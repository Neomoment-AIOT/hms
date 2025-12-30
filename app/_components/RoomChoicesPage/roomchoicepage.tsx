"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { FaBed, FaHome, FaUser, FaChild, FaChevronDown } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";

const roomsData = [
  {
    id: 1,
    name: "Deluxe Room",
    nameAr: "غرفة ديلوكس",
    price: 240,
    beds: 1,
    adults: 2,
    children: 1,
    image: "/Hotel_Room/deluxeroom.jpeg",
  },
  {
    id: 2,
    name: "Double Room",
    nameAr: "غرفة مزدوجة",
    price: 260,
    beds: 3,
    adults: 4,
    children: 3,
    image: "/Hotel_Room/studiosuite.jpeg",
  },
  {
    id: 3,
    name: "Family Suite",
    nameAr: "جناح عائلي",
    price: 220,
    beds: 4,
    adults: 6,
    children: 3,
    image: "/Hotel_Room/familyroom.jpeg",
  },
  {
    id: 4,
    name: "Hexagonal Room",
    nameAr: "غرفة سداسية",
    price: 280,
    beds: 2,
    adults: 5,
    children: 4,
    image: "/Hotel_Room/luxuryroom.jpeg",
  },
];

export default function RoomChoicesPage() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const router = useRouter();

  const [openRoom, setOpenRoom] = useState<number | null>(null);
  const [roomCounts, setRoomCounts] = useState<{ [key: number]: number }>(
    roomsData.reduce((acc, room) => {
      acc[room.id] = 1;
      return acc;
    }, {} as { [key: number]: number })
  );

  const increment = (id: number) => {
    setRoomCounts({ ...roomCounts, [id]: roomCounts[id] + 1 });
  };

  const decrement = (id: number) => {
    if (roomCounts[id] > 1) {
      setRoomCounts({ ...roomCounts, [id]: roomCounts[id] - 1 });
    }
  };

  return (
    <div
      className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${isArabic ? "font-arabic" : ""
        }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Step Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <p className="text-sm text-gray-500">
          {isArabic
            ? "عملية حجز الغرفة من 3 خطوات"
            : "Your 3 steps process to book a room"}
        </p>
        <h2 className="font-semibold">
          {isArabic ? "الخطوة #01" : "Step #01"}
        </h2>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-teal-600 rounded-full w-1/4" />
        </div>
        <button className="mt-3 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-4 py-1.5 rounded">
          {isArabic ? "اختر غرفتك" : "Choose your room"}
        </button>
      </div>

      {/* Room Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {roomsData.map((room) => {
          const totalPrice = room.price * roomCounts[room.id];

          return (
            <div key={room.id} className="border rounded-lg p-4 bg-white">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FaBed />
                  {isArabic ? room.nameAr : room.name} (
                  {roomCounts[room.id]}x)
                </h3>

                <button
                  onClick={() =>
                    setOpenRoom(openRoom === room.id ? null : room.id)
                  }
                >
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
                    <h4 className="font-medium">
                      {isArabic ? room.nameAr : room.name}
                    </h4>
                    <span className="inline-flex items-center mt-1 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white text-ms px-2 py-0.5 rounded">
                      <img
                        src="/Riyal_White.png"
                        alt="Riyal"
                        className="w-4 h-4 mr-1"
                      />
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
                    <FaChild /> {isArabic ? "الأطفال" : "Children"}{" "}
                    {room.children}
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
                    <span>
                      {isArabic ? "عدد الغرف" : "Number of Rooms"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(room.id)}
                        className="px-2 py-1"
                      >
                        -
                      </button>
                      <span>{roomCounts[room.id]}</span>
                      <button
                        onClick={() => increment(room.id)}
                        className="px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="border-t" />

                  <div className="flex justify-between">
                    <span>{isArabic ? "السبب" : "Reason"}</span>
                    <span>
                      {isArabic
                        ? "رابط التحميل مكسور"
                        : "Download link is broken"}
                    </span>
                  </div>

                  <div className="border-t" />

                  <div className="flex justify-between items-center">
                    <span>{isArabic ? room.nameAr : room.name}</span>
                    <span className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white text-xs px-2 py-0.5 rounded-full">
                      {isArabic ? "نعم" : "Yes"}
                    </span>
                  </div>

                  <div className="border-t" />

                  {/* TOTAL PRICE (UPDATED LOGIC) */}
                  <div className="flex justify-between font-semibold items-center">
                    <span>
                      {isArabic ? "إجمالي الرسوم" : "Total Charges"}
                    </span>
                    <span className="flex items-center gap-1">
                      <img
                        src="/Riyal_Black.png"
                        alt="Riyal"
                        className="w-4 h-4"
                      />
                      {totalPrice}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t mt-4 pt-3 text-sm">
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 border rounded py-2 text-ms">
                      {isArabic
                        ? "اختر واحدة أخرى"
                        : "Choose another one"}
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/Guest-Detail?roomId=${room.id}&count=${roomCounts[room.id]}`
                        )
                      }
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
