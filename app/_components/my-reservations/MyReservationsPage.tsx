"use client";

import { useState, useContext } from "react";
import { LangContext } from "@/app/lang-provider";

function StatusTag({ label, color, isArabic }: { label: string; color: string; isArabic: boolean }) {
  return (
    <div className="flex items-center">
      <div
        className="relative pl-6 pr-4 py-1 text-white text-xs font-semibold"
        style={{
          backgroundColor: color,
          clipPath: isArabic
            ? "polygon(100% 50%, 85% 0%, 0% 0%, 0% 100%, 85% 100%)"
            : "polygon(0% 50%, 15% 0%, 100% 0%, 100% 100%, 15% 100%)",
        }}
      >
        {label}
      </div>

      <div
        className={`w-2 h-2 rounded-full bg-white ${isArabic ? "-mr-3" : "-ml-3"}`}
      />
    </div>
  );
}

const reservationsData = [
  {
    id: "BK001",
    room: "Deluxe Room",
    stayFrom: "15-01-2026",
    stayTo: "20-01-2026",
    rooms: 2,
    meals: "Breakfast, Lunch",
    guests: "1 Adult 1 Child",
    price: 250,
    status: "confirmed",
  },
  {
    id: "BK002",
    room: "Double Room",
    stayFrom: "01-01-2026",
    stayTo: "05-01-2026",
    rooms: 2,
    meals: "Breakfast",
    guests: "1 Adult 1 Child",
    price: 290,
    status: "cancelled",
  },
  {
    id: "BK003",
    room: "Family Suite",
    stayFrom: "01-01-2026",
    stayTo: "07-01-2026",
    rooms: 2,
    meals: "Breakfast, Lunch, Dinner",
    guests: "1 Adult 1 Child",
    price: 300,
    status: "unconfirmed",
  },
];

export default function MyReservationsPage() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? reservationsData
      : reservationsData.filter((r) => r.status === filter);

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">
        {isArabic ? "حجوزاتي" : "My Reservations"}
      </h1>

      {/* Tabs – mobile safe */}
      <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
        {[
          { key: "all", label: isArabic ? "الكل" : "All" },
          { key: "confirmed", label: isArabic ? "مؤكد" : "Confirmed" },
          { key: "unconfirmed", label: isArabic ? "غير مؤكد" : "Unconfirmed" },
          { key: "cancelled", label: isArabic ? "ملغى" : "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 whitespace-nowrap border-b-2 font-medium ${
              filter === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-6 w-full md:w-[800px] mx-auto">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-6 shadow-sm bg-white space-y-2 w-full"
          >
            <h2 className="text-lg font-semibold">
              {isArabic
                ? b.room === "Deluxe Room"
                  ? "غرفة ديلوكس"
                  : b.room === "Double Room"
                  ? "غرفة مزدوجة"
                  : "جناح عائلي"
                : b.room}
            </h2>

            {/* Booking ID */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">
                {isArabic ? "معرّف الحجز" : "Booking ID"}:
              </span>
              {b.id}
              <StatusTag
                label={
                  b.status === "confirmed"
                    ? isArabic ? "مؤكد" : "Confirmed"
                    : b.status === "cancelled"
                    ? isArabic ? "ملغى" : "Cancelled"
                    : isArabic ? "غير مؤكد" : "Unconfirmed"
                }
                color={
                  b.status === "confirmed"
                    ? "#16A34A"
                    : b.status === "cancelled"
                    ? "#DC2626"
                    : "#C67115"
                }
                isArabic={isArabic}
              />
            </div>

            <p>
              <span className="font-medium">
                {isArabic ? "تاريخ الإقامة" : "Stay Date"}:
              </span>{" "}
              {b.stayFrom} | {b.stayTo}
            </p>

            <p>
              <span className="font-medium">
                {isArabic ? "الغرف" : "Rooms"}:
              </span>{" "}
              {b.rooms}
            </p>

            <p>
              <span className="font-medium">
                {isArabic ? "الوجبات" : "Meals"}:
              </span>{" "}
              {isArabic
                ? b.meals
                    .replace("Breakfast", "إفطار")
                    .replace("Lunch", "غداء")
                    .replace("Dinner", "عشاء")
                : b.meals}
            </p>

            {/* Guests + Button */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <p>
                <span className="font-medium">
                  {isArabic ? "الضيوف" : "Guests"}:
                </span>{" "}
                {isArabic
                  ? b.guests.replace("Adult", "بالغ").replace("Child", "طفل")
                  : b.guests}
              </p>

              {b.status === "confirmed" && (
                <button className="bg-red-600 text-white px-4 py-1 rounded-md text-sm font-semibold">
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              )}

              {b.status === "unconfirmed" && (
                <button className="bg-green-600 text-white px-4 py-1 rounded-md text-sm font-semibold">
                  {isArabic ? "تأكيد" : "Confirm"}
                </button>
              )}
            </div>

            <hr className="my-2" />

            <p className="text-lg font-bold flex items-center gap-2">
              <img src="/Riyal_Black.png" alt="SAR" className="w-5 h-5 inline-block" />
              {b.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
