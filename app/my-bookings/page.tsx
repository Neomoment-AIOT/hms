"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaUser,
    FaChild,
    FaDoorOpen,
    FaCalendarAlt,
} from "react-icons/fa";
import Header from "../_components/header/page";
import Footer from "../_components/footer/page";
import { LangContext } from "@/app/lang-provider";

type Booking = {
    id: string;
    name: string;
    hotelEn: string;
    hotelAr: string;
    image: string;
    rooms: number;
    adults: number;
    children: number;
    statusEn: string;
    statusAr: string;
    checkIn: string;
    checkOut: string;
};

export default function MyBookingsPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"individual" | "group">("individual");
    const { lang } = useContext(LangContext);
    const isArabic = lang === "ar";

    const [individualBookings, setIndividualBookings] = useState<Booking[]>([]);
    const [groupBookings, setGroupBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/bookings");
                const json = await res.json();

                if (!json.ok) {
                    setError(json.error || "Failed to load bookings");
                    setLoading(false);
                    return;
                }

                // Map Odoo booking data to our Booking type
                const mapBooking = (b: Record<string, unknown>): Booking => ({
                    id: String(b.name || b.id || ""),
                    name: (b.partner_name as string) || (b.customer_name as string) || "",
                    hotelEn: (b.hotel_name as string) || (b.company_name as string) || "",
                    hotelAr: (b.hotel_name as string) || "",
                    image: "/hotel/hotel1.jpg",
                    rooms: (b.room_count as number) || 1,
                    adults: (b.adults as number) || (b.adult_count as number) || 1,
                    children: (b.children as number) || (b.child_count as number) || 0,
                    statusEn: (b.state as string) || "confirmed",
                    statusAr: (b.state as string) || "مؤكد",
                    checkIn: (b.check_in as string) || (b.checkin_date as string) || "",
                    checkOut: (b.check_out as string) || (b.checkout_date as string) || "",
                });

                const bookings = (json.data.bookings || []).map(mapBooking);
                const groups = (json.data.group_bookings || []).map(mapBooking);

                setIndividualBookings(bookings);
                setGroupBookings(groups);
            } catch {
                setError(isArabic ? "فشل تحميل الحجوزات" : "Failed to load bookings");
            }
            setLoading(false);
        };

        fetchBookings();
    }, [isArabic]);

    const handleCancel = async (bookingId: string) => {
        const confirmed = window.confirm(
            isArabic ? "هل أنت متأكد من إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?"
        );
        if (!confirmed) return;

        setCancellingId(bookingId);
        try {
            // Extract numeric ID from booking name like "Raffah / 00567"
            const numericId = bookingId.replace(/\D/g, "");
            const res = await fetch(`/api/bookings/${numericId}/cancel`, { method: "POST" });
            const json = await res.json();

            if (json.ok) {
                // Remove from list
                setIndividualBookings((prev) => prev.filter((b) => b.id !== bookingId));
                setGroupBookings((prev) => prev.filter((b) => b.id !== bookingId));
            } else {
                alert(json.error || "Failed to cancel");
            }
        } catch {
            alert(isArabic ? "فشل إلغاء الحجز" : "Failed to cancel booking");
        }
        setCancellingId(null);
    };

    const bookings = tab === "individual" ? individualBookings : groupBookings;

    return (
        <>
            <Header />
            <div
                className={`min-h-screen bg-[#F2F4F4] p-8 mt-15 ${isArabic ? "font-arabic" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 mb-6"
                >
                    {isArabic ? (
                        <>
                            <FaArrowRight /> رجوع
                        </>
                    ) : (
                        <>
                            <FaArrowLeft /> Back
                        </>
                    )}
                </button>

                {/* Container */}
                <div className="bg-white rounded-xl p-6 shadow">
                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setTab("individual")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "individual"
                                ? "bg-gray-100 text-black"
                                : "text-gray-500"
                                }`}
                        >
                            {isArabic ? "الحجز الفردي" : "Individual Booking"}
                        </button>

                        <button
                            onClick={() => setTab("group")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "group"
                                ? "bg-gray-100 text-black"
                                : "text-gray-500"
                                }`}
                        >
                            {isArabic ? "الحجز الجماعي" : "Group Booking"}
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-12 text-gray-500">
                            {isArabic ? "جاري تحميل الحجوزات..." : "Loading bookings..."}
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    )}

                    {/* Empty */}
                    {!loading && !error && bookings.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {isArabic ? "لا توجد حجوزات" : "No bookings found"}
                        </div>
                    )}

                    {/* Cards */}
                    {!loading && !error && bookings.length > 0 && (
                        <div className="flex gap-6 flex-wrap">
                            {bookings.map((b) => (
                                <div
                                    key={b.id}
                                    className="w-[360px] border rounded-xl p-5 shadow-sm bg-white"
                                >
                                    <div
                                        className={`flex gap-4 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                        <img
                                            src={b.image}
                                            alt={isArabic ? b.hotelAr : b.hotelEn}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />

                                        <div>
                                            <h3 className="font-semibold">{b.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {isArabic ? b.hotelAr : b.hotelEn}
                                            </p>
                                            <span className="inline-block mt-1 text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                                                {b.id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-5 space-y-2 text-sm text-gray-700">
                                        <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <FaDoorOpen />
                                            {isArabic ? "عدد الغرف" : "Room count"}
                                            <span className="ml-auto">{b.rooms}</span>
                                        </p>
                                        <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <FaUser />
                                            {isArabic ? "البالغون" : "Adults"}
                                            <span className="ml-auto">{b.adults}</span>
                                        </p>
                                        <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <FaChild />
                                            {isArabic ? "الأطفال" : "Children"}
                                            <span className="ml-auto">{b.children}</span>
                                        </p>
                                        <p>
                                            <strong>{isArabic ? "الحالة" : "Status"}</strong>
                                            <span className="ml-2 text-gray-500">
                                                {isArabic ? b.statusAr : b.statusEn}
                                            </span>
                                        </p>
                                        <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <FaCalendarAlt />
                                            {isArabic ? "تسجيل الوصول" : "Check-in"}
                                            <span className="ml-auto">{b.checkIn}</span>
                                        </p>
                                        <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <FaCalendarAlt />
                                            {isArabic ? "تسجيل المغادرة" : "Check-out"}
                                            <span className="ml-auto">{b.checkOut}</span>
                                        </p>
                                    </div>

                                    {/* Cancel */}
                                    <button
                                        onClick={() => handleCancel(b.id)}
                                        disabled={cancellingId === b.id}
                                        className="mt-6 w-full bg-[#1F8593] text-white py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                                    >
                                        {cancellingId === b.id
                                            ? (isArabic ? "جاري الإلغاء..." : "Cancelling...")
                                            : (isArabic ? "إلغاء الحجز" : "Cancel Booking")}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
