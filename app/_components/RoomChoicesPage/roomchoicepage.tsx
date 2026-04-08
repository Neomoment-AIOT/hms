"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaBed, FaHome, FaUser, FaChild, FaChevronDown } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";

type RoomData = {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  beds: number;
  adults: number;
  children: number;
  image: string;
};

// NOTE: Fallback rooms COMMENTED OUT for API testing
// All room data should come from Odoo API only
const fallbackRooms: RoomData[] = [];

const roomImages = ["/Hotel_Room/deluxeroom.jpeg", "/Hotel_Room/studiosuite.jpeg", "/Hotel_Room/familyroom.jpeg", "/Hotel_Room/luxuryroom.jpeg"];

export default function RoomChoicesPage() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const hotelId = searchParams.get("hotelId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomParam = searchParams.get("room") || "1";
  const adultParam = searchParams.get("adult") || "1";
  const childrenParam = searchParams.get("children") || "0";

  const [rooms, setRooms] = useState<RoomData[]>(fallbackRooms);
  const [loading, setLoading] = useState(false);
  const [openRoom, setOpenRoom] = useState<number | null>(null);
  const [roomCounts, setRoomCounts] = useState<{ [key: number]: number }>({});

  // Initialize room counts when rooms change
  useEffect(() => {
    setRoomCounts(
      rooms.reduce((acc, room) => {
        acc[room.id] = 1;
        return acc;
      }, {} as { [key: number]: number })
    );
  }, [rooms]);

  // Fetch rooms from API when hotelId + dates are present
  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/rooms/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotel_id: Number(hotelId),
            check_in_date: checkIn,
            check_out_date: checkOut,
            person_count: Number(adultParam),
            room_count: Number(roomParam),
          }),
        });
        const json = await res.json();

        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          const hotelData = json.data[0];
          const roomTypes = hotelData.room_types || [];

          if (roomTypes.length > 0) {
            const mappedRooms: RoomData[] = roomTypes.map(
              (rt: { id: number; type: string; pax: number; room_count: number }, index: number) => ({
                id: rt.id,
                name: rt.type,
                nameAr: rt.type, // Odoo returns single name
                price: 0, // Will be fetched via rates API
                beds: rt.room_count,
                adults: rt.pax,
                children: 0,
                image: roomImages[index % roomImages.length],
              })
            );

            // Fetch rates for each room type
            const roomsWithPrices = await Promise.all(
              mappedRooms.map(async (room) => {
                try {
                  const rateRes = await fetch("/api/rooms/rates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      room_type_id: room.id,
                      total_person_count: Number(adultParam),
                      total_child_count: Number(childrenParam),
                      check_in_date: checkIn,
                      check_out_date: checkOut,
                    }),
                  });
                  const rateJson = await rateRes.json();
                  if (rateJson.ok && Array.isArray(rateJson.data) && rateJson.data.length > 0) {
                    const rate = rateJson.data[0];
                    const price = rate.price?.adult || rate.pax_1 || 0;
                    return { ...room, price };
                  }
                } catch {
                  // Rate fetch failed, keep price as 0
                }
                return room;
              })
            );

            setRooms(roomsWithPrices);
            setLoading(false);
            return;
          }
        }
      } catch {
        // API failed
      }
      // Fallback to hardcoded rooms
      setRooms(fallbackRooms);
      setLoading(false);
    };

    fetchRooms();
  }, [hotelId, checkIn, checkOut, adultParam, childrenParam, roomParam]);

  const increment = (id: number) => {
    setRoomCounts({ ...roomCounts, [id]: (roomCounts[id] || 1) + 1 });
  };

  const decrement = (id: number) => {
    if ((roomCounts[id] || 1) > 1) {
      setRoomCounts({ ...roomCounts, [id]: roomCounts[id] - 1 });
    }
  };

  const handleBookRoom = (room: RoomData) => {
    const params = new URLSearchParams();
    if (hotelId) params.set("hotelId", hotelId);
    params.set("roomTypeId", String(room.id));
    params.set("roomId", String(room.id)); // backward compat
    params.set("count", String(roomCounts[room.id] || 1));
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", adultParam);
    params.set("children", childrenParam);

    router.push(`/Guest-Detail?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="text-center py-12 text-gray-500">
          {isArabic ? "جاري تحميل الغرف المتاحة..." : "Loading available rooms..."}
        </div>
      </div>
    );
  }

  if (!loading && rooms.length === 0) {
    return (
      <div className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="text-center py-12 text-red-500">
          {!hotelId
            ? (isArabic ? "معرّف الفندق مفقود من الرابط. يرجى اختيار فندق أولاً." : "Hotel ID missing from URL. Please select a hotel first.")
            : (isArabic ? "لا توجد غرف متاحة من API. تحقق من اتصال Odoo." : "No rooms available from API. Check Odoo connection.")}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Step Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <p className="text-sm text-gray-500">
          {isArabic ? "عملية حجز الغرفة من 3 خطوات" : "Your 3 steps process to book a room"}
        </p>
        <h2 className="font-semibold">{isArabic ? "الخطوة #01" : "Step #01"}</h2>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-teal-600 rounded-full w-1/4" />
        </div>
        <button className="mt-3 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-4 py-1.5 rounded">
          {isArabic ? "اختر غرفتك" : "Choose your room"}
        </button>
      </div>

      {/* Room Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const totalPrice = room.price * (roomCounts[room.id] || 1);

          return (
            <div key={room.id} className="border rounded-lg p-4 bg-white">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FaBed />
                  {isArabic ? room.nameAr : room.name} ({roomCounts[room.id] || 1}x)
                </h3>
                <button onClick={() => setOpenRoom(openRoom === room.id ? null : room.id)}>
                  <FaChevronDown />
                </button>
              </div>

              {/* Content */}
              <div className="rounded p-3 bg-gray-50">
                {/* Image + Info */}
                <div className="flex gap-3">
                  <img
                    src={room.image}
                    alt={isArabic ? room.nameAr : room.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{isArabic ? room.nameAr : room.name}</h4>
                    <span className="inline-flex items-center mt-1 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white text-ms px-2 py-0.5 rounded">
                      <img src="/Riyal_White.png" alt="Riyal" className="w-4 h-4 mr-1" />
                      {room.price}
                    </span>
                  </div>
                </div>

                {/* Beds / Adults / Children */}
                <div className="flex gap-4 text-ms space-x-7 justify-center text-gray-600 mt-3">
                  <span className="flex items-center gap-1">
                    <FaHome /> {isArabic ? "غرفة" : "Room"} {room.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser /> {isArabic ? "البالغون" : "Adults"} {room.adults}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaChild /> {isArabic ? "الأطفال" : "Children"} {room.children}
                  </span>
                </div>

                {/* Total & Controls */}
                <div className="mt-4 text-ms space-y-2">
                  <div className="flex justify-between">
                    <span>{isArabic ? room.nameAr : room.name}</span>
                    <span>{isArabic ? "المجموع" : "Total"}</span>
                  </div>

                  <div className="border-t" />

                  {/* Number of Rooms */}
                  <div className="flex justify-between items-center mt-3">
                    <span>{isArabic ? "عدد الغرف" : "Number of Rooms"}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => decrement(room.id)} className="px-2 py-1">-</button>
                      <span>{roomCounts[room.id] || 1}</span>
                      <button onClick={() => increment(room.id)} className="px-2 py-1">+</button>
                    </div>
                  </div>

                  <div className="border-t" />

                  {/* TOTAL PRICE */}
                  <div className="flex justify-between font-semibold items-center">
                    <span>{isArabic ? "إجمالي الرسوم" : "Total Charges"}</span>
                    <span className="flex items-center gap-1">
                      <img src="/Riyal_Black.png" alt="Riyal" className="w-4 h-4" />
                      {totalPrice}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t mt-4 pt-3 text-sm">
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 border rounded py-2 text-ms">
                      {isArabic ? "اختر واحدة أخرى" : "Choose another one"}
                    </button>
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="flex-1 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white rounded py-2 text-ms"
                    >
                      {isArabic ? "حجز الغرفة" : "Book a Room"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
