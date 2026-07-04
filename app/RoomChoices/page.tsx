"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../_components/header/page";
import HotelTab from "../_components/RoomChoicesPage/HotelTab";
import RoomChoicesPage from "../_components/RoomChoicesPage/roomchoicepage";
import Footer from "../_components/footer/page";

const fallbackImages = [
  "/Hotel_Room/deluxeroom.jpeg",
  "/Hotel_Room/studiosuite.jpeg",
  "/Hotel_Room/familyroom.jpeg",
  "/Hotel_Room/luxuryroom.jpeg",
];

export default function RoomPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomParam = searchParams.get("room") || "1";
  const adultParam = searchParams.get("adult") || "1";

  const [hotelName, setHotelName] = useState("");
  const [roomImages, setRoomImages] = useState<string[]>(fallbackImages);

  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;

    fetch("/api/rooms/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: Number(hotelId),
        check_in_date: checkIn,
        check_out_date: checkOut,
        person_count: Number(adultParam),
        room_count: Number(roomParam),
        person_email: "",
        person_id: 0,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          const hotelData = json.data[0];
          if (hotelData.hotel_name) setHotelName(hotelData.hotel_name);
          const imgs: string[] = (hotelData.room_types || [])
            .map((rt: { image?: string }) => rt.image)
            .filter(Boolean) as string[];
          if (imgs.length > 0) setRoomImages(imgs);
        }
      })
      .catch(() => {});
  }, [hotelId, checkIn, checkOut, adultParam, roomParam]);

  return (
    <div>
      <Header />
      <HotelTab hotelName={hotelName} roomImages={roomImages} />
      <RoomChoicesPage />
      <Footer />
    </div>
  );
}
