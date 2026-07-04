"use client";

import { useState, useContext, useEffect } from "react";
import { LangContext } from "@/app/lang-provider";
import { getUser } from "@/app/utils/auth";

type RoomLine = {
  id: number;
  room_type: string | null;
  state: string;
  room: string | null;
};

type Booking = {
  booking_id: number;
  booking_name: string;
  reference_number: string;
  hotel_name: string | null;
  room_count: number;
  state: string;
  adult_count: number;
  child_count: number;
  checkin_date: string;
  checkout_date: string;
  room_line_ids: RoomLine[];
};

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
      <div className={`w-2 h-2 rounded-full bg-white ${isArabic ? "-mr-3" : "-ml-3"}`} />
    </div>
  );
}

function formatDate(dt: string): string {
  if (!dt) return "—";
  return dt.split(" ")[0] || dt;
}

function mapState(state: string): "confirmed" | "unconfirmed" | "cancelled" {
  if (["confirm", "confirmed", "checked_in", "checked_out"].includes(state)) return "confirmed";
  if (["cancel", "no_show"].includes(state)) return "cancelled";
  return "unconfirmed";
}

export default function MyReservationsPage() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = getUser();
      if (!user?.email) { setBookings([]); setLoading(false); return; }

      setLoading(true);
      try {
        const res = await fetch("/api/bookings/retrieve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partner_email: user.email }),
        });
        const json = await res.json();
        if (json.ok) {
          const all: Booking[] = [
            ...(json.data.bookings || []),
            ...(json.data.group_bookings || []),
          ];
          setBookings(all);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      }
      setLoading(false);
    };

    load();

    // Re-fetch when auth changes (login / logout / return from payment)
    window.addEventListener("auth-change", load);
    return () => window.removeEventListener("auth-change", load);
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return mapState(b.state) === filter;
  });

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">
        {isArabic ? "حجوزاتي" : "My Reservations"}
      </h1>

      {/* Tabs */}
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
              filter === tab.key ? "border-black text-black" : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          {isArabic ? "جاري التحميل..." : "Loading..."}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {isArabic ? "لا توجد حجوزات" : "No reservations found."}
        </div>
      )}

      {/* Cards */}
      <div className="space-y-6 w-full md:w-[800px] mx-auto">
        {filtered.map((b) => {
          const status = mapState(b.state);
          const roomType = b.room_line_ids?.[0]?.room_type || (isArabic ? "غرفة" : "Room");

          return (
            <div key={b.booking_id} className="border rounded-lg p-6 shadow-sm bg-white space-y-2 w-full">
              <h2 className="text-lg font-semibold">{roomType}</h2>

              {/* Booking ID */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{isArabic ? "معرّف الحجز" : "Booking ID"}:</span>
                {b.reference_number || b.booking_name}
                <StatusTag
                  label={
                    status === "confirmed"
                      ? isArabic ? "مؤكد" : "Confirmed"
                      : status === "cancelled"
                      ? isArabic ? "ملغى" : "Cancelled"
                      : isArabic ? "غير مؤكد" : "Unconfirmed"
                  }
                  color={
                    status === "confirmed" ? "#16A34A" : status === "cancelled" ? "#DC2626" : "#C67115"
                  }
                  isArabic={isArabic}
                />
              </div>

              {b.hotel_name && (
                <p>
                  <span className="font-medium">{isArabic ? "الفندق" : "Hotel"}:</span>{" "}
                  {b.hotel_name}
                </p>
              )}

              <p>
                <span className="font-medium">{isArabic ? "تاريخ الإقامة" : "Stay Date"}:</span>{" "}
                {formatDate(b.checkin_date)} | {formatDate(b.checkout_date)}
              </p>

              <p>
                <span className="font-medium">{isArabic ? "الغرف" : "Rooms"}:</span>{" "}
                {b.room_count}
              </p>

              <div className="flex justify-between items-center flex-wrap gap-2">
                <p>
                  <span className="font-medium">{isArabic ? "الضيوف" : "Guests"}:</span>{" "}
                  {b.adult_count} {isArabic ? "بالغ" : "Adult"}{b.child_count > 0 ? `, ${b.child_count} ${isArabic ? "طفل" : "Child"}` : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
