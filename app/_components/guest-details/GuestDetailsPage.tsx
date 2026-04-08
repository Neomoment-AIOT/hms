"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaStar, FaDownload, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { format, addDays } from "date-fns";
import { LangContext } from "@/app/lang-provider";
import { generateBookingPDF } from "@/app/utils/generateBookingPDF";
import { getPDFLabels } from "@/app/utils/pdfLabels";

// NOTE: Hardcoded countries COMMENTED OUT for API testing — loaded from /api/geo/countries-states
const countries: string[] = [];

// NOTE: Hardcoded roomsData COMMENTED OUT for API testing — room info should come from URL params
const roomsData: { id: number; name: string; price: number }[] = [];

// NOTE: Hardcoded MEAL_PRICES COMMENTED OUT for API testing — should come from Odoo hotel services API (M4)
// Keeping values for now since Odoo meal pricing API does not exist yet
const MEAL_PRICES = {
  breakfast: 120,
  lunch: 150,
  dinner: 100,
};

const Riyal = () => <img src="/Riyal_Black.png" alt="Riyal" className="inline w-4 h-4" />;

export default function GuestDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  // Read expanded URL params
  const hotelId = searchParams.get("hotelId");
  const roomTypeId = Number(searchParams.get("roomTypeId") || searchParams.get("roomId"));
  const count = Number(searchParams.get("count")) || 1;
  const adultsParam = searchParams.get("adults") || "1";
  const childrenParam = searchParams.get("children") || "0";

  const selectedRoom = roomsData.find((r) => r.id === roomTypeId);

  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1));
  const [apiCountries, setApiCountries] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Hotel detail from API
  const [hotelDetail, setHotelDetail] = useState<{
    name: string; phone: string; star_rating: number; location: string;
    logo: string | null; room_types: { id: number; type: string; pax: number }[];
  } | null>(null);

  useEffect(() => {
    const inDate = searchParams.get("checkIn");
    const outDate = searchParams.get("checkOut");

    if (inDate) setCheckIn(new Date(inDate + "T00:00:00"));
    if (outDate) setCheckOut(new Date(outDate + "T00:00:00"));
  }, [searchParams]);

  // Fetch hotel details from API
  useEffect(() => {
    if (!hotelId || !searchParams.get("checkIn") || !searchParams.get("checkOut")) return;
    fetch(`/api/hotels/${hotelId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkin_date: searchParams.get("checkIn"),
        checkout_date: searchParams.get("checkOut"),
        room_count: 1,
        adult_count: Number(adultsParam),
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data?.hotel) {
          setHotelDetail(json.data.hotel);
        }
      })
      .catch(() => {});
  }, [hotelId, searchParams, adultsParam]);

  // Fetch countries from API
  useEffect(() => {
    fetch("/api/geo/countries-states")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data)) {
          setApiCountries(json.data.map((c: { country: string }) => c.country));
        }
      })
      .catch(() => {});
  }, []);

  const displayCountries = apiCountries.length > 0 ? apiCountries : countries;

  // Derive room name from API hotel detail or fallback roomsData
  const apiRoom = hotelDetail?.room_types?.find((rt) => rt.id === roomTypeId);
  const effectiveRoomName = apiRoom?.type || selectedRoom?.name || "N/A";
  const effectiveHotelName = hotelDetail?.name || "N/A (loading...)";
  const effectiveHotelRating = hotelDetail?.star_rating || 0;
  const effectiveHotelPhone = hotelDetail?.phone || "";
  const effectiveHotelLocation = hotelDetail?.location || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const toggleMeal = (meal: "breakfast" | "lunch" | "dinner") => {
    setMeals((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  const mealsTotal =
    (meals.breakfast ? MEAL_PRICES.breakfast : 0) +
    (meals.lunch ? MEAL_PRICES.lunch : 0) +
    (meals.dinner ? MEAL_PRICES.dinner : 0);

  const roomTotal = selectedRoom ? selectedRoom.price * count : 0;
  const services = 300;
  const grandTotal = roomTotal +  mealsTotal;

  const handleDownloadPDF = () => {
    const labels = getPDFLabels(isArabic);
    generateBookingPDF({
      bookingRef: "TBD",
      guestName: `${firstName || "Guest"} ${lastName || ""}`.trim(),
      email: email || "N/A",
      roomName: effectiveRoomName || "N/A",
      roomCount: count,
      checkIn: format(checkIn, "dd MMM yyyy"),
      checkOut: format(checkOut, "dd MMM yyyy"),
      hotelName: effectiveHotelName,
      hotelAddress: effectiveHotelLocation || "N/A",
      hotelPhone: effectiveHotelPhone ? `+966 ${effectiveHotelPhone}` : "N/A",
      rating: `${effectiveHotelRating} / 5`,
      meals,
      mealPrices: MEAL_PRICES,
      roomPrice: roomTotal,
      totalAmount: grandTotal,
      isArabic,
      labels,
    });
  };

  const handleContinueToPayment = async () => {
    const bookingData = {
      roomName: effectiveRoomName,
      roomCount: count,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      meals,
      totalAmount: roomTotal + mealsTotal,
      guestName: `${firstName || "Guest"} ${lastName || ""}`.trim(),
      email: email || "N/A",
      roomPrice: roomTotal,
      hotelId: hotelId ? Number(hotelId) : undefined,
      bookingId: undefined as string | undefined,
    };

    // Try to create booking via API if hotelId is present
    if (hotelId) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            check_in_date: format(checkIn, "yyyy-MM-dd"),
            check_out_date: format(checkOut, "yyyy-MM-dd"),
            hotel_id: Number(hotelId),
            customer_details: {
              first_name: firstName || "Guest",
              last_name: lastName || "",
              email: email || "",
              mobile: "",
            },
            rooms: [{
              room_type_id: roomTypeId,
              pax: Number(adultsParam) + Number(childrenParam),
              adults: Number(adultsParam),
              children: Number(childrenParam),
            }],
          }),
        });

        const json = await res.json();
        setSubmitting(false);

        if (json.ok) {
          // Extract booking ID from response
          const bid = json.data?.booking_id || json.data?.id || json.data?.name || "";
          bookingData.bookingId = String(bid);
          sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
          router.push(`/PayementSuccess?bookingId=${bid}`);
          return;
        } else if (res.status === 401) {
          alert(isArabic ? "يرجى تسجيل الدخول أولاً لإتمام الحجز" : "Please sign in first to complete your booking");
          return;
        } else {
          alert(json.error || (isArabic ? "فشل تأكيد الحجز" : "Booking confirmation failed"));
          return;
        }
      } catch {
        setSubmitting(false);
        // Fall through to sessionStorage fallback
      }
    }

    // Fallback: store in sessionStorage (no API)
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/PayementSuccess");
  };


  return (
    <div className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
      {/* STEP BAR */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <p className="text-sm text-gray-500">{isArabic ? "عملية الحجز من 3 خطوات" : "Your 3 steps process to book a room"}</p>
        <h2 className="font-semibold">{isArabic ? "الخطوة #02" : "Step #02"}</h2>

        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-teal-600 rounded-full w-2/3" />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT – ENTER GUEST DETAIL */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h3 className="font-semibold text-lg">{isArabic ? "أدخل تفاصيل الضيف" : "Enter Guest Detail"}</h3>

          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{isArabic ? "الاسم الأول" : "First name"}</label>
              <input
                placeholder={isArabic ? "اسمك الأول" : "Your first name"}
                className="mt-1 w-full border rounded px-3 py-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{isArabic ? "اسم العائلة" : "Last name"}</label>
              <input
                placeholder={isArabic ? "اسم عائلتك" : "Your last name"}
                className="mt-1 w-full border rounded px-3 py-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email & Country */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{isArabic ? "البريد الإلكتروني" : "Email address"}</label>
              <div className="relative mt-1">
                <FaEnvelope className={`absolute ${isArabic ? "right-3" : "left-3"} top-3 text-gray-400`} />
                <input
                  placeholder={isArabic ? "بريدك الإلكتروني" : "Your email"}
                  className={`w-full border rounded px-3 py-2 ${isArabic ? "pr-10" : "pl-10"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{isArabic ? "الدولة" : "Country"}</label>
              <select className="mt-1 w-full border rounded px-3 py-2">
                <option>{isArabic ? "دولتك" : "Your country"}</option>
                {displayCountries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add more detail */}
          <div>
            <label className="text-sm font-medium">{isArabic ? "أضف المزيد من التفاصيل" : "Add more detail"}</label>
            <textarea
              placeholder={isArabic ? "أرسل رسالة" : "Send message"}
              className="mt-1 w-full border rounded px-3 py-2 h-32"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">{isArabic ? "أنا أحجز لشخص آخر ولن أقيم في العقار." : "I am booking for someone else and I will not be staying at the property."}</span>
          </div>

          {/* Booking Reference */}
          <div>
            <label className="text-sm font-medium">{isArabic ? "مرجع الحجز" : "Booking Reference"}</label>
            <input
              placeholder={isArabic ? "مرجع الحجز الخاص بك" : "Your booking reference"}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              {isArabic ? "طلبات خاصة (ليست مضمونة)" : "Special requests (not guaranteed)"}
            </label>
            <p className="text-xs text-gray-500">
              {isArabic ? "الطلبات الخاصة غير مضمونة وتخضع لتقدير العقار. قد تنطبق رسوم إضافية حسب سياسات العقار." : "Special requests are not guaranteed and are at the property's discretion. Additional charges may apply. depending on the property poilicies."}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              {isArabic ? "لدي طلبات أخرى" : "I have other requests"}
            </label>
            <textarea
              placeholder={isArabic ? "أرسل رسالة" : "Send message"}
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>
        </div>

        {/* RIGHT – BOOKING SUMMARY */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">{isArabic ? "ملخص الحجز" : "Booking Summary"}</h3>
            <span className="text-xs text-gray-500">{format(checkIn, isArabic ? "yyyy/MM/dd" : "dd/MM/yyyy")} • {format(checkOut, isArabic ? "yyyy/MM/dd" : "dd/MM/yyyy")}</span>
          </div>

          {/* HOTEL CARD */}
          <div className="flex gap-3 items-start mb-4">
            <img
              src={hotelDetail?.logo || "/Hotel_Room/luxuryroom.jpeg"}
              className="w-16 h-16 rounded object-cover"
              alt="hotel"
            />

            <div className="flex-1">
              <h4 className="font-semibold">{effectiveHotelName}</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaStar className="text-yellow-400" /> {effectiveHotelRating} / 5
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="border px-2 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <FaDownload /> {isArabic ? "تحميل PDF" : "Download PDF"}
            </button>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
            <FaMapMarkerAlt />
            <p>{effectiveHotelLocation || (isArabic ? "الموقع غير متوفر" : "Location not available")}</p>
          </div>

          {/* DETAILS */}
          <div className="text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">{isArabic ? "مرجع الحجز" : "Booking Ref."}</span>
              <span className="text-gray-400 italic">{isArabic ? "سيتم إنشاؤه عند التأكيد" : "Generated on confirm"}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-gray-500">{isArabic ? "اختر الوجبة/الوجبات" : "Select Meal(s)"}</span>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={meals.breakfast} onChange={() => toggleMeal("breakfast")} />
                  {isArabic ? <>إفطار (+ <Riyal /> {MEAL_PRICES.breakfast})</> : <>Breakfast (+ <Riyal /> {MEAL_PRICES.breakfast})</>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={meals.lunch} onChange={() => toggleMeal("lunch")} />
                  {isArabic ? <>غداء (+ <Riyal /> {MEAL_PRICES.lunch})</> : <>Lunch (+ <Riyal /> {MEAL_PRICES.lunch})</>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={meals.dinner} onChange={() => toggleMeal("dinner")} />
                  {isArabic ? <>عشاء (+ <Riyal /> {MEAL_PRICES.dinner})</> : <>Dinner (+ <Riyal /> {MEAL_PRICES.dinner})</>}
                </label>
              </div>
            </div>

            <div className="border-t pt-3 text-sm">
              <p>{isArabic ? `الغرفة ${count}: ${effectiveRoomName}` : `Room ${count}: ${effectiveRoomName}`}</p>
              <p className="text-gray-500">{isArabic ? `البالغ: ${adultsParam} | الأطفال: ${childrenParam} | إجمالي العدد: ${Number(adultsParam) + Number(childrenParam)}` : `Adult: ${adultsParam} | Children: ${childrenParam} | Total Pax: ${Number(adultsParam) + Number(childrenParam)}`}</p>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">{isArabic ? "تفصيل السعر" : "Price Breakdown"}</h4>
            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>{isArabic ? "خدمات الوجبات" : "Meal Services"}</span>

                <span className="flex items-center gap-1">
                  <img src="/Riyal_Black.png" alt="Riyal" className="w-4 h-4" />
                  <span>
                    {mealsTotal === 0 ? "0.00" : mealsTotal}
                  </span>
                </span>
              </div>

              <div className="flex justify-between">
                <span>{isArabic ? `الغرفة ${count} ${effectiveRoomName}` : `Room ${count} ${effectiveRoomName}`}</span>
                <span className="flex items-center gap-1">
                  <Riyal /> <span>{roomTotal}</span>
                </span>
              </div>

              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>{isArabic ? "الإجمالي" : "Total"}</span>
                <span className="flex items-center gap-1 bg-orange-100 px-2 rounded">
                  <Riyal /> <span>{grandTotal}</span>
                </span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>{isArabic ? "المبلغ الواجب دفعه" : "Amount to pay"}</span>
                <span className="flex items-center gap-1 bg-green-100 px-2 rounded">
                  <Riyal /> <span>{grandTotal}</span>
                </span>
              </div>
            </div>
            <button
  onClick={handleContinueToPayment}
  disabled={submitting}
  className="w-full mt-6 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded disabled:opacity-50"
>
              {submitting
                ? (isArabic ? "جاري تأكيد الحجز..." : "Confirming booking...")
                : (isArabic ? "المتابعة للدفع" : "Continue to payment")}
            </button>
          </div>
        </div>

        {/* CHECK-IN & FEES SECTION */}
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          {/* LEFT – CHECK-IN INSTRUCTION */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-lg mb-3">{isArabic ? "تعليمات تسجيل الوصول" : "Check-in Instruction"}</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>{isArabic ? "• يبدأ وقت تسجيل الوصول الساعة 3:00 مساءً" : "• Check-in time starts at 3:00 PM"}</li>
              <li>{isArabic ? "• مطلوب بطاقة هوية صادرة عن جهة حكومية" : "• Valid government-issued ID is required"}</li>
              <li>{isArabic ? "• مطلوب بطاقة ائتمان للرسوم العرضية" : "• Credit card required for incidental charges"}</li>
              <li>{isArabic ? "• تسجيل الوصول المبكر حسب التوفر" : "• Early check-in subject to availability"}</li>
            </ul>
          </div>

          {/* RIGHT – FEES & EXTRA */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-lg mb-3">{isArabic ? "الرسوم والإضافات" : "Fees and Extra"}</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>{isArabic ? <>• سرير إضافي: <Riyal /> 100 لكل ليلة</> : <>• Extra bed: <Riyal /> 100 per night</>}</li>
              <li>{isArabic ? "• قد يتم تطبيق رسوم تسجيل خروج متأخر" : "• Late checkout fee may apply"}</li>
              <li>{isArabic ? "• خدمة التوصيل من المطار متاحة (رسوم إضافية)" : "• Airport pickup available (additional charge)"}</li>
              <li>{isArabic ? "• الضرائب مشمولة حيثما ينطبق" : "• Taxes included where applicable"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}