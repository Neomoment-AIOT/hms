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
    FaEnvelope,
} from "react-icons/fa";
import Header from "../_components/header/page";
import Footer from "../_components/footer/page";
import { LangContext } from "@/app/lang-provider";
import { getUser } from "@/app/utils/auth";

type Booking = {
    id: string;       // display ref (booking_name)
    odooId: number;   // numeric primary key — used for cancel API
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
    amount: number;
};

const STATUS_LABELS: Record<string, { en: string; ar: string; color: string }> = {
    confirmed:     { en: "Confirmed",     ar: "مؤكد",       color: "bg-green-100 text-green-700" },
    not_confirmed: { en: "Pending",       ar: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
    check_in:      { en: "Checked In",   ar: "تم الوصول",   color: "bg-blue-100 text-blue-700" },
    check_out:     { en: "Checked Out",  ar: "تم المغادرة",  color: "bg-gray-100 text-gray-600" },
    block:         { en: "Blocked",      ar: "محظور",        color: "bg-red-100 text-red-600" },
    cancel:     { en: "Cancelled",    ar: "ملغي",         color: "bg-red-100 text-red-600" },
};

function statusLabel(state: string, isArabic: boolean) {
    const s = STATUS_LABELS[state];
    if (!s) return { label: state, color: "bg-gray-100 text-gray-500" };
    return { label: isArabic ? s.ar : s.en, color: s.color };
}

function mapBooking(b: Record<string, unknown>): Booking {
    return {
        id:       String(b.booking_name || b.name || b.booking_id || ""),
        odooId:   Number(b.booking_id || b.id || 0),
        name:     (b.partner_name   as string) || (b.customer_name as string) || "",
        hotelEn:  (b.hotel_name     as string) || (b.company_name  as string) || "",
        hotelAr:  (b.hotel_name     as string) || "",
        image:    (b.room_image as string) ||
                  ((b.hotel_id || b.company_id)
                    ? `/api/images?model=res.company&id=${b.hotel_id || b.company_id}&field=logo`
                    : "/Hotel_Room/luxuryroom.jpeg"),
        rooms:    (b.room_count     as number) || 1,
        adults:   (b.adult_count    as number) || (b.adults    as number) || 1,
        children: (b.child_count    as number) || (b.children  as number) || 0,
        statusEn: (b.state          as string) || "not_confirmed",
        statusAr: (b.state          as string) || "not_confirmed",
        checkIn:  (b.checkin_date   as string) || (b.check_in  as string) || "",
        checkOut: (b.checkout_date  as string) || (b.check_out as string) || "",
        amount:   (b.amount_total   as number) || 0,
    };
}

export default function MyBookingsPage() {
    const router = useRouter();
    const { lang } = useContext(LangContext);
    const isArabic = lang === "ar";

    const [tab, setTab]                           = useState<"individual" | "group">("individual");
    const [individualBookings, setIndividualBookings] = useState<Booking[]>([]);
    const [groupBookings, setGroupBookings]           = useState<Booking[]>([]);
    const [loading, setLoading]                   = useState(true);
    const [error, setError]                       = useState("");
    const [cancellingId, setCancellingId]         = useState<string | null>(null);
    const [guestEmail, setGuestEmail]             = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError("");

            const authUser = getUser();

            // ── Path A: logged-in user ─────────────────────────────
            if (authUser) {
                try {
                    const res  = await fetch("/api/bookings");
                    const json = await res.json();

                    if (!json.ok) {
                        setError(json.error || (isArabic ? "فشل تحميل الحجوزات" : "Failed to load bookings"));
                        setLoading(false);
                        return;
                    }

                    setIndividualBookings((json.data.bookings       || []).map(mapBooking));
                    setGroupBookings(     (json.data.group_bookings || []).map(mapBooking));
                } catch {
                    setError(isArabic ? "فشل تحميل الحجوزات" : "Failed to load bookings");
                }
                setLoading(false);
                return;
            }

            // ── Path B: guest — email from sessionStorage ──────────
            const email = sessionStorage.getItem("retrieve_email");

            if (!email) {
                // No auth, no email — nothing to show
                setError(isArabic ? "يرجى العودة وإدخال بريدك الإلكتروني" : "Please go back and enter your email");
                setLoading(false);
                return;
            }

            setGuestEmail(email);

            try {
                const res  = await fetch("/api/bookings/retrieve", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ partner_email: email }),
                });
                const json = await res.json();

                if (!json.ok) {
                    setError(json.error || (isArabic ? "فشل تحميل الحجوزات" : "Failed to load bookings"));
                    setLoading(false);
                    return;
                }

                setIndividualBookings((json.data.bookings       || []).map(mapBooking));
                setGroupBookings(     (json.data.group_bookings || []).map(mapBooking));
            } catch {
                setError(isArabic ? "فشل تحميل الحجوزات" : "Failed to load bookings");
            }

            setLoading(false);
        };

        fetchBookings();

        const onAuthChange = () => window.location.reload();
        window.addEventListener("auth-change", onAuthChange);
        return () => window.removeEventListener("auth-change", onAuthChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = async (booking: Booking) => {
        const confirmed = window.confirm(
            isArabic ? "هل أنت متأكد من إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?"
        );
        if (!confirmed) return;

        setCancellingId(booking.id);
        try {
            const res  = await fetch(`/api/bookings/${booking.odooId}/cancel`, { method: "POST" });
            const json = await res.json();

            if (json.ok) {
                window.location.reload();
            } else {
                alert(json.error || (isArabic ? "فشل إلغاء الحجز" : "Failed to cancel"));
                setCancellingId(null);
            }
        } catch {
            alert(isArabic ? "فشل إلغاء الحجز" : "Failed to cancel booking");
            setCancellingId(null);
        }
    };

    const bookings = tab === "individual" ? individualBookings : groupBookings;

    return (
        <>
            <Header />
            <div
                className={`min-h-screen bg-[#F2F4F4] p-8 mt-20 ${isArabic ? "font-arabic" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors"
                >
                    {isArabic ? <><FaArrowRight /> رجوع</> : <><FaArrowLeft /> Back</>}
                </button>

                {/* Guest email banner */}
                {guestEmail && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                        <FaEnvelope className="text-teal-600" />
                        {isArabic ? `الحجوزات الخاصة بـ: ${guestEmail}` : `Bookings for: ${guestEmail}`}
                    </div>
                )}

                {/* Container */}
                <div className="bg-white rounded-xl p-6 shadow">
                    {/* Tabs */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setTab("individual")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                tab === "individual" ? "bg-teal-600 text-white" : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {isArabic ? "الحجز الفردي" : "Individual Booking"}
                            {individualBookings.length > 0 && (
                                <span className="ml-2 bg-white text-teal-700 text-xs rounded-full px-2 py-0.5">
                                    {individualBookings.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setTab("group")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                tab === "group" ? "bg-teal-600 text-white" : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {isArabic ? "الحجز الجماعي" : "Group Booking"}
                            {groupBookings.length > 0 && (
                                <span className="ml-2 bg-white text-teal-700 text-xs rounded-full px-2 py-0.5">
                                    {groupBookings.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-16 text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3" />
                            {isArabic ? "جاري تحميل الحجوزات..." : "Loading bookings..."}
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-16">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => router.push("/")}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                {isArabic ? "العودة للرئيسية" : "Back to Home"}
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && bookings.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <FaCalendarAlt className="mx-auto text-4xl mb-3 text-gray-200" />
                            <p>{isArabic ? "لا توجد حجوزات" : "No bookings found"}</p>
                        </div>
                    )}

                    {/* Cards */}
                    {!loading && !error && bookings.length > 0 && (
                        <div className="flex gap-6 flex-wrap">
                            {bookings.map((b) => {
                                const { label, color } = statusLabel(b.statusEn, isArabic);
                                return (
                                    <div
                                        key={b.id}
                                        className="w-[360px] border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                                    >
                                        <div className={`flex gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
                                            <img
                                                src={b.image}
                                                alt={isArabic ? b.hotelAr : b.hotelEn}
                                                className="w-20 h-20 rounded-lg object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/Hotel_Room/luxuryroom.jpeg"; }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{b.name}</h3>
                                                <p className="text-sm text-gray-500">{isArabic ? b.hotelAr : b.hotelEn}</p>
                                                <span className="inline-block mt-1 text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                                                    {b.id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status badge */}
                                        <div className={`mt-3 inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
                                            {label}
                                        </div>

                                        {/* Details */}
                                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                                            <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                <FaDoorOpen className="text-teal-600" />
                                                <span>{isArabic ? "عدد الغرف" : "Rooms"}</span>
                                                <span className="ml-auto font-semibold">{b.rooms}</span>
                                            </p>
                                            <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                <FaUser className="text-teal-600" />
                                                <span>{isArabic ? "البالغون" : "Adults"}</span>
                                                <span className="ml-auto font-semibold">{b.adults}</span>
                                            </p>
                                            <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                <FaChild className="text-teal-600" />
                                                <span>{isArabic ? "الأطفال" : "Children"}</span>
                                                <span className="ml-auto font-semibold">{b.children}</span>
                                            </p>
                                            <div className="border-t pt-2 mt-2 space-y-1">
                                                <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                    <FaCalendarAlt className="text-teal-600" />
                                                    <span>{isArabic ? "الوصول" : "Check-in"}</span>
                                                    <span className="ml-auto font-semibold">{b.checkIn}</span>
                                                </p>
                                                <p className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                    <FaCalendarAlt className="text-teal-600" />
                                                    <span>{isArabic ? "المغادرة" : "Check-out"}</span>
                                                    <span className="ml-auto font-semibold">{b.checkOut}</span>
                                                </p>
                                            </div>
                                            {b.amount > 0 && (
                                                <p className={`flex items-center gap-2 border-t pt-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                                                    <span className="text-gray-500">{isArabic ? "المبلغ الإجمالي" : "Total amount"}</span>
                                                    <span className="ml-auto font-bold text-teal-700">
                                                        <img src="/Riyal_Black.png" alt="SAR" className="inline w-3 h-3 mr-0.5" />
                                                        {b.amount.toFixed(2)}
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Cancel */}
                                        {(b.statusEn === "not_confirmed" || b.statusEn === "confirmed") && (
                                            <button
                                                onClick={() => handleCancel(b)}
                                                disabled={cancellingId === b.id}
                                                className="mt-5 w-full bg-[#1F8593] text-white py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                                            >
                                                {cancellingId === b.id
                                                    ? (isArabic ? "جاري الإلغاء..." : "Cancelling...")
                                                    : (isArabic ? "إلغاء الحجز" : "Cancel Booking")}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
