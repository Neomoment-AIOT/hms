"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaDownload, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";
import { generateBookingPDF } from "@/app/utils/generateBookingPDF";
import { getPDFLabels } from "@/app/utils/pdfLabels";

/* ---------------- CONSTANTS ---------------- */

const POLL_DELAY_MS = 3000;  // wait 3s after landing before the single poll

const Riyal = () => (
  <img src="/Riyal_Black.png" alt="Riyal" className="inline w-6 h-6" />
);

/* ---------------- TYPES ---------------- */

type BookingState = "polling" | "confirmed" | "under_review";

type OdooBooking = {
  id:            number;
  name:          string;
  state:         string;
  ref_id_bk:     string;
  checkin_date:  string;
  checkout_date: string;
  hotel_name:    string;
  guest_name:    string;
  email:         string;
  mobile:        string;
  adults:        number;
  children:      number;
  room_type:     string;
  meal_pattern:  string;
  amount_total:  number;
};

/* ---------------- COMPONENT ---------------- */

export default function PaymentSuccessPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { lang }     = useContext(LangContext);
  const isArabic     = lang === "ar";

  const urlInvoiceId = searchParams.get("invoiceId") || "";
  const urlPaymentId = searchParams.get("paymentId") || "";
  const urlOrderRef  = searchParams.get("orderRef")  || "";

  const [bookingState, setBookingState] = useState<BookingState>("polling");
  const [booking, setBooking]           = useState<OdooBooking | null>(null);
  const [paidAmount, setPaidAmount]     = useState<number>(0);

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Load paid amount from sessionStorage (set before redirect) ── */
  useEffect(() => {
    const stored = sessionStorage.getItem("bookingData");
    if (stored) {
      try {
        const bd = JSON.parse(stored);
        if (bd.totalAmount) setPaidAmount(Number(bd.totalAmount));
      } catch { /* ignore */ }
    }
  }, []);

  /* ── Single poll after delay ── */
  useEffect(() => {
    if (!urlOrderRef) {
      setBookingState("under_review");
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/booking/status?orderRef=${encodeURIComponent(urlOrderRef)}`);
        const data = await res.json();

        if (data.status === "found" && data.booking) {
          const b: OdooBooking = data.booking;
          setBooking(b);
          setBookingState(b.state === "confirmed" ? "confirmed" : "under_review");
        } else {
          setBookingState("under_review");
        }
      } catch {
        setBookingState("under_review");
      }
    }, POLL_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrderRef]);

  /* ── PDF download ── */
  const handleDownloadPDF = () => {
    if (!booking) return;
    const labels = getPDFLabels(isArabic);
    generateBookingPDF({
      bookingRef:   `MF-${urlInvoiceId}`,
      guestName:    booking.guest_name  || "Guest",
      email:        booking.email       || "N/A",
      roomName:     booking.room_type   || "Hotel Room",
      roomCount:    1,
      checkIn:      booking.checkin_date,
      checkOut:     booking.checkout_date,
      hotelName:    booking.hotel_name  || "Hotel",
      hotelAddress: isArabic
        ? "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية"
        : "BeAl Aqiq, King Fahd Branch Rd, Riyadh 13515, Saudi Arabia",
      hotelPhone:   "+966 920010417",
      rating:       "3 / 5",
      selectedMeals: booking.meal_pattern
        ? [{ description: booking.meal_pattern, unit_price: 0 }]
        : [],
      roomPrice:    booking.amount_total > 0 ? booking.amount_total : paidAmount,
      totalAmount:  booking.amount_total > 0 ? booking.amount_total : paidAmount,
      isArabic,
      labels,
    });
  };

  /* ═══════════════════════ RENDER STATES ═══════════════════════ */

  /* ── Polling spinner ── */
  if (bookingState === "polling") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="w-14 h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-lg font-medium">
          {isArabic ? "جاري تأكيد الحجز…" : "Confirming your booking…"}
        </p>
        <p className="text-gray-400 text-sm">
          {isArabic ? "يرجى الانتظار، قد يستغرق ذلك بضع ثوانٍ" : "This may take a few seconds"}
        </p>
      </div>
    );
  }

  /* ── Under Review (payment ok, booking not confirmed in time) ── */
  if (bookingState === "under_review") {
    return (
      <div className={`max-w-2xl mx-auto mt-10 md:mt-24 p-6 md:p-10 ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <FaExclamationTriangle className="text-amber-400 text-6xl mx-auto" />

          <h1 className="text-2xl font-semibold text-gray-800">
            {isArabic ? "الحجز قيد المراجعة" : "Booking Under Review"}
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
            <p className="text-amber-800 font-medium">
              {isArabic
                ? "✅ تم استلام دفعتك بنجاح"
                : "✅ Your payment was received successfully"}
            </p>
            <p className="text-amber-700 text-sm">
              {isArabic
                ? "يتم الآن مراجعة حجزك وسيتم إرسال تأكيد بالبريد الإلكتروني خلال 15 دقيقة."
                : "Your booking is being reviewed. You will receive a confirmation email within 15 minutes."}
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>
              {isArabic ? "رقم مرجع الدفع:" : "Payment Reference:"}
              {" "}
              <span className="font-mono font-medium text-gray-700">MF-{urlInvoiceId}</span>
            </p>
            {urlOrderRef && (
              <p>
                {isArabic ? "رقم الطلب:" : "Order Ref:"}
                {" "}
                <span className="font-mono font-medium text-gray-700">{urlOrderRef}</span>
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-medium mb-1">
              {isArabic ? "هل تحتاج مساعدة؟" : "Need help?"}
            </p>
            <p>{isArabic ? "تواصل مع الدعم:" : "Contact support:"}</p>
            <p className="font-medium text-teal-700">+966 920010417</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/hotel")}
              className="flex-1 bg-teal-700 text-white py-3 rounded-xl font-medium"
            >
              {isArabic ? "الرئيسية" : "Back to Hotels"}
            </button>
            <button
              onClick={() => router.push("/my-bookings")}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-medium"
            >
              {isArabic ? "حجوزاتي" : "My Bookings"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Confirmed booking ── */
  if (bookingState === "confirmed" && booking) {
    // Odoo total_rate_after_discount is the ground truth — use it.
    // Fall back to sessionStorage paidAmount only if Odoo returns 0.
    const displayAmount = booking.amount_total > 0 ? booking.amount_total : paidAmount;

    return (
      <div
        className={`max-w-4xl mx-auto mt-10 md:mt-24 p-4 md:p-10 space-y-6 md:space-y-10 ${isArabic ? "font-arabic" : ""}`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
          <h1 className="text-2xl md:text-4xl mt-2 font-semibold">
            {isArabic ? "تم الدفع وتأكيد الحجز" : "Payment & Booking Confirmed"}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">

          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between text-base md:text-lg gap-2">
            <span className="font-semibold">{isArabic ? "ملخص الحجز" : "Booking Summary"}</span>
            <span className="text-gray-600">{booking.checkin_date} → {booking.checkout_date}</span>
          </div>

          {/* Room + hotel row */}
          <div className={`flex flex-col md:flex-row gap-6 items-center md:items-start ${isArabic ? "md:flex-row-reverse" : ""}`}>
            <img
              src="/Hotel_Room/luxuryroom.jpeg"
              className="w-full md:w-24 h-48 md:h-24 rounded-xl object-cover"
              alt="hotel"
            />
            <div className={`flex-1 text-center ${isArabic ? "md:text-right" : "md:text-left"}`}>
              <h4 className="font-semibold text-xl">{booking.room_type || "Hotel Room"}</h4>
              <p className="text-gray-500 text-sm">{booking.hotel_name}</p>
              <div className={`flex items-center gap-2 text-base text-gray-600 justify-center ${isArabic ? "md:justify-end" : "md:justify-start"}`}>
                <FaStar className="text-yellow-400 text-lg" /> 3 / 5
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="w-full md:w-auto border px-4 py-2 rounded-lg text-base flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FaDownload /> {isArabic ? "تحميل PDF" : "Download PDF"}
            </button>
          </div>

          {/* Address */}
          <div className={`flex items-start gap-3 text-base text-gray-600 ${isArabic ? "md:flex-row-reverse text-right" : ""}`}>
            <FaMapMarkerAlt className="text-xl shrink-0 mt-1" />
            <p>{isArabic
              ? "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية."
              : "BeAl Aqiq, RRAA8604, 8604 King Fahd Branch Rd, Riyadh 13515, Saudi Arabia."
            }</p>
          </div>

          {/* Booking details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "رقم الحجز" : "Booking Ref"}
              </p>
              <p className="font-mono font-semibold">MF-{urlInvoiceId}</p>
              {booking.name && (
                <p className="text-gray-500 text-xs">{booking.name}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "اسم الضيف" : "Guest"}
              </p>
              <p className="font-semibold">{booking.guest_name}</p>
              {booking.email && <p className="text-gray-500 text-xs">{booking.email}</p>}
              {booking.mobile && <p className="text-gray-500 text-xs">{booking.mobile}</p>}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "تفاصيل الإقامة" : "Stay"}
              </p>
              <p><span className="font-medium">{isArabic ? "تسجيل الوصول:" : "Check-in:"}</span> {booking.checkin_date}</p>
              <p><span className="font-medium">{isArabic ? "تسجيل المغادرة:" : "Check-out:"}</span> {booking.checkout_date}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "الضيوف" : "Guests"}
              </p>
              <p>{isArabic ? "بالغون:" : "Adults:"} <span className="font-medium">{booking.adults}</span></p>
              <p>{isArabic ? "أطفال:" : "Children:"} <span className="font-medium">{booking.children}</span></p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "خطة الوجبات" : "Meal Plan"}
              </p>
              <p className="font-medium">{booking.meal_pattern || (isArabic ? "غير محدد" : "Not specified")}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 space-y-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                {isArabic ? "حالة الحجز" : "Booking Status"}
              </p>
              <p className="font-semibold text-green-700">
                ✅ {isArabic ? "مؤكد" : "Confirmed"}
              </p>
            </div>
          </div>

          {/* Price breakdown */}
          <div>
            <h4 className="font-semibold mb-4 text-xl">{isArabic ? "تفصيل السعر" : "Price Breakdown"}</h4>
            <div className="space-y-4 text-sm md:text-base">
              <div className="flex justify-between">
                <span>{booking.room_type || (isArabic ? "الغرفة" : "Room")}</span>
                <span className="font-medium"><Riyal /> {displayAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                <span>{isArabic ? "الإجمالي المدفوع" : "Total Paid"}</span>
                <span className="bg-green-100 px-4 py-1 rounded-lg shrink-0">
                  <Riyal /> {displayAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex flex-col md:flex-row gap-4 md:gap-6 ${isArabic ? "md:flex-row-reverse" : ""}`}>
            <button
              className="w-full bg-teal-700 text-white py-4 rounded-xl text-lg font-medium"
              onClick={() => router.push("/my-bookings")}
            >
              {isArabic ? "الذهاب إلى حجوزاتي" : "Go to My Bookings"}
            </button>
            <button
              className="w-full bg-gray-200 py-4 rounded-xl text-lg font-medium"
              onClick={() => router.push("/hotel")}
            >
              {isArabic ? "استكشاف الفنادق" : "Explore Hotels"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Fallback loading (should not reach here) ── */
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
