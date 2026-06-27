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

// Meals are loaded dynamically from the hotel API (hotelDetail.meals)

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

  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const [checkIn, setCheckIn] = useState<Date>(
    checkInParam ? new Date(checkInParam + "T00:00:00") : new Date()
  );
  const [checkOut, setCheckOut] = useState<Date>(
    checkOutParam ? new Date(checkOutParam + "T00:00:00") : addDays(new Date(), 1)
  );
  const [apiCountries, setApiCountries] = useState<string[]>([]);
  const [submitting, setSubmitting]           = useState(false);
  const [loadingMethods, setLoadingMethods]   = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);

  type PaymentMethod = {
    id: number; nameEn: string; nameAr: string;
    imageUrl: string; totalAmount: number; currencyIso: string; serviceCharge: number;
  };
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);

  // Booking snapshot built once — reused when user picks a payment method
  const pendingBookingRef = useRef<{
    bookingData: Record<string, unknown>;
    orderRef: string;
    description: string;
  } | null>(null);

  // Room price fetched from /api/rooms/rates (partner-aware)
  // adultPrice = Odoo total for adults (all nights × 1 room); childPrice = same for children
  const [roomPrice, setRoomPrice]       = useState<number>(0);   // adult total (kept for display)
  const [childPrice, setChildPrice]     = useState<number>(0);   // child total
  const [roomPriceLoading, setRoomPriceLoading] = useState(false);
  // Incremented on auth-change so the rates useEffect re-fires on login/logout
  const [authVersion, setAuthVersion] = useState(0);

  type DiscountInfo = {
    is_active: boolean;
    value: number;
    type: "percentage" | "amount" | null;
    scope: "total" | "line_wise" | null;  // 'total' = All Room, 'line_wise' = Per Room
    applies_to: "room_only" | "rate_meals";
  };

  // Hotel detail from API
  const [hotelDetail, setHotelDetail] = useState<{
    name: string; phone: string; star_rating: number; location: string;
    logo: string | null; room_types: { id: number; type: string; pax: number }[];
    meals?: { id: number; description: string; unit_price: number; child_price: number; meal_type: string; default: boolean }[];
    services?: { id: number; name: string; unit_price: number; rhythm: string }[];
    meal_pattern_id?: number;
    discount?: DiscountInfo;
  } | null>(null);

  useEffect(() => {
    if (checkInParam) setCheckIn(new Date(checkInParam + "T00:00:00"));
    if (checkOutParam) setCheckOut(new Date(checkOutParam + "T00:00:00"));
  }, [checkInParam, checkOutParam]);

  // Fetch hotel details — BFF reads person_id from HTTP-only cookie automatically
  useEffect(() => {
    if (!hotelId || !checkInParam || !checkOutParam) return;
    fetch(`/api/hotels/${hotelId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkin_date: checkInParam,
        checkout_date: checkOutParam,
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
  }, [hotelId, checkInParam, checkOutParam, adultsParam]);

  // Re-fetch room rate whenever params or auth state change
  useEffect(() => {
    if (!roomTypeId || !checkInParam || !checkOutParam) return;
    let cancelled = false;
    setRoomPriceLoading(true);
    fetch("/api/rooms/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_type_id: roomTypeId,
        total_person_count: Number(adultsParam),
        total_child_count: Number(childrenParam),
        check_in_date: checkInParam,
        check_out_date: checkOutParam,
        // person_id intentionally omitted — BFF reads from HTTP-only cookie
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          const rate = json.data[0];
          setRoomPrice(rate.price?.adult || rate.pax_1 || 0);
          setChildPrice(rate.price?.child || 0);
        } else {
          setRoomPrice(0);
          setChildPrice(0);
        }
      })
      .catch(() => { if (!cancelled) { setRoomPrice(0); setChildPrice(0); } })
      .finally(() => { if (!cancelled) setRoomPriceLoading(false); });
    return () => { cancelled = true; };
  // authVersion bumps whenever the user logs in/out so we re-fetch with new cookie
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeId, checkInParam, checkOutParam, adultsParam, childrenParam, authVersion]);

  // Listen for login/logout and bump authVersion to re-trigger the rates fetch
  useEffect(() => {
    const onAuthChange = () => setAuthVersion((v) => v + 1);
    window.addEventListener("auth-change", onAuthChange);
    return () => window.removeEventListener("auth-change", onAuthChange);
  }, []);

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

  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [email, setEmail]                 = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  type FormErrors = { firstName?: string; lastName?: string; email?: string; country?: string };
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!firstName.trim()) errors.firstName = isArabic ? "الاسم الأول مطلوب" : "First name is required";
    if (!lastName.trim())  errors.lastName  = isArabic ? "اسم العائلة مطلوب" : "Last name is required";
    if (!email.trim()) {
      errors.email = isArabic ? "البريد الإلكتروني مطلوب" : "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = isArabic ? "البريد الإلكتروني غير صحيح" : "Enter a valid email address";
    }
    if (!selectedCountry) errors.country = isArabic ? "الدولة مطلوبة" : "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // All meals from hotel settings are automatically included
  const apiMeals = hotelDetail?.meals || [];
  const selectedMeals = apiMeals;

  // Calculate meal total: (adults × days × unit_price) + (children × days × child_price) for each meal
  const numAdults = Number(adultsParam);
  const numChildren = Number(childrenParam);
  const numDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const mealsTotal = selectedMeals.reduce((sum, m) => {
    const adultMealCost = numAdults * numDays * (m.unit_price || 0) * count;
    const childMealCost = numChildren * numDays * (m.child_price || 0) * count;
    return sum + adultMealCost + childMealCost;
  }, 0);

  // (adult_total + child_total) is Odoo's price for 1 room × all nights
  // multiply by room count to get the full booking cost
  const roomTotal  = (roomPrice + childPrice) * count;
  const grandTotal = roomTotal + mealsTotal;

  // ── Discount from rate.detail Discount tab ────────────────────────
  const disc = hotelDetail?.discount;
  const discountActive = disc?.is_active && (disc?.value ?? 0) > 0;

  const computeRoomDiscount = (): number => {
    if (!discountActive || !disc) return 0;
    if (disc.type === "percentage") return roomTotal * disc.value / 100;
    if (disc.type === "amount") {
      // Odoo: amount × nights for All Room; amount × rooms × nights for Per Room
      if (disc.scope === "line_wise") return disc.value * count * numDays;
      return disc.value * numDays;
    }
    return 0;
  };

  const computeMealDiscount = (): number => {
    if (!discountActive || !disc || disc.applies_to === "room_only") return 0;
    if (disc.type === "percentage") return mealsTotal * disc.value / 100;
    if (disc.type === "amount") {
      if (disc.scope === "line_wise") return disc.value * count * numDays;
      return disc.value * numDays;
    }
    return 0;
  };

  const roomDiscountAmt  = computeRoomDiscount();
  const mealDiscountAmt  = computeMealDiscount();
  const totalDiscountAmt = roomDiscountAmt + mealDiscountAmt;

  const discountedRoomTotal  = Math.max(0, roomTotal  - roomDiscountAmt);
  const discountedMealsTotal = Math.max(0, mealsTotal - mealDiscountAmt);
  const discountedGrandTotal = discountedRoomTotal + discountedMealsTotal;

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
      selectedMeals: selectedMeals.map((m) => ({ description: m.description, unit_price: m.unit_price })),
      roomPrice: roomPrice,
      totalAmount: grandTotal,
      isArabic,
      labels,
    });
  };

  // ── Phase 1: "Continue to Payment" click ─────────────────────────
  // Validates form, builds booking snapshot, fetches available payment
  // methods from MyFatoorah, then shows the method-selection modal.
  const payableAmount = discountActive ? discountedGrandTotal : grandTotal;

  const handleContinueToPayment = async () => {
    if (!validateForm()) return;

    if (payableAmount <= 0) {
      alert(isArabic ? "المبلغ الإجمالي غير صحيح" : "Invalid total amount");
      return;
    }

    setLoadingMethods(true);

    const bookingData = {
      roomName:    effectiveRoomName,
      roomCount:   count,
      checkIn:     format(checkIn, "yyyy-MM-dd"),
      checkOut:    format(checkOut, "yyyy-MM-dd"),
      meals:       selectedMeals.map((m) => ({ id: m.id, description: m.description, unit_price: m.unit_price })),
      totalAmount: payableAmount,
      guestName:   `${firstName || "Guest"} ${lastName || ""}`.trim(),
      email:       email || "N/A",
      roomPrice,
      hotelId:     hotelId ? Number(hotelId) : undefined,
      roomTypeId,
      adults:      Number(adultsParam),
      children:    Number(childrenParam),
    };

    const orderRef   = `HMS-${hotelId || "0"}-${Date.now()}`;
    const description = `Hotel booking — ${effectiveHotelName} (${format(checkIn, "dd MMM")} – ${format(checkOut, "dd MMM yyyy")})`;

    // Save pending data — will be used after the user picks a method
    pendingBookingRef.current = { bookingData, orderRef, description };

    try {
      const res  = await fetch("/api/payment/methods", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: payableAmount }),
      });
      const json = await res.json();

      if (json.ok && json.methods?.length > 0) {
        setPaymentMethods(json.methods);
        setShowMethodModal(true);
      } else {
        // No methods returned — fallback: go straight to initiate (auto-picks)
        await handlePayWithMethod(null);
      }
    } catch {
      alert(isArabic ? "خطأ في الاتصال بخدمة الدفع" : "Error connecting to payment service");
    } finally {
      setLoadingMethods(false);
    }
  };

  // ── Phase 2: User picked a payment method (or null = auto-pick) ──
  const handlePayWithMethod = async (methodId: number | null) => {
    setShowMethodModal(false);
    setSubmitting(true);

    const pending = pendingBookingRef.current;
    if (!pending) { setSubmitting(false); return; }
    const { bookingData, orderRef, description } = pending;

    try {
      const initiateRes = await fetch("/api/payment/initiate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          amount:          payableAmount,
          currency:        "SAR",
          orderRef,
          description,
          hotelId:         hotelId ? Number(hotelId) : undefined,
          roomTypeId,
          checkIn:         format(checkIn, "yyyy-MM-dd"),
          checkOut:        format(checkOut, "yyyy-MM-dd"),
          paymentMethodId: methodId ?? undefined,
          customer: {
            firstName: firstName || "Guest",
            lastName:  lastName  || "",
            email:     email     || "",
          },
        }),
      });

      const initiateJson = await initiateRes.json();

      if (!initiateRes.ok || !initiateJson.ok) {
        setSubmitting(false);
        alert(initiateJson.error || (isArabic ? "تعذّر بدء الدفع" : "Could not initiate payment"));
        return;
      }

      // ── Save full booking data server-side so the webhook can confirm in Odoo ──
      // The webhook fires server-to-server and has no access to sessionStorage,
      // so we persist everything keyed by orderRef before the browser leaves.
      await fetch("/api/payment/booking-session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          orderRef,
          hotelId:        hotelId ? Number(hotelId) : 0,
          roomTypeId,
          roomCount:      count,
          checkIn:        format(checkIn, "yyyy-MM-dd"),
          checkOut:       format(checkOut, "yyyy-MM-dd"),
          adults:         Number(adultsParam),
          children:       Number(childrenParam),
          pax:            Number(adultsParam) + Number(childrenParam),
          guestFirstName: firstName || "Guest",
          guestLastName:  lastName  || "",
          guestEmail:     email     || "",
          guestMobile:    "",
          guestCountry:   selectedCountry || "",
          amount:         payableAmount,
          meals:          selectedMeals.map((m) => ({ id: m.id, description: m.description, unit_price: m.unit_price })),
          mealPatternId:  hotelDetail?.meal_pattern_id ,  // from API, fallback to Room Only (id=4)
        }),
      });

      // Save browser-side snapshot — restored by /payment/callback after redirect
      (bookingData as Record<string, unknown>).bookingId = orderRef;
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      sessionStorage.setItem("invoiceId",   String(initiateJson.invoiceId));

      // Redirect to MyFatoorah hosted checkout page
      window.location.href = initiateJson.checkoutWebUrl;

    } catch {
      setSubmitting(false);
      alert(isArabic ? "خطأ في الاتصال بخدمة الدفع" : "Error connecting to payment service");
    }
  };


  return (
    <>
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
              <label className="text-sm font-medium">
                {isArabic ? "الاسم الأول" : "First name"} <span className="text-red-500">*</span>
              </label>
              <input
                placeholder={isArabic ? "اسمك الأول" : "Your first name"}
                className={`mt-1 w-full border rounded px-3 py-2 ${formErrors.firstName ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : ""}`}
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); if (formErrors.firstName) setFormErrors((p) => ({ ...p, firstName: undefined })); }}
              />
              {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">
                {isArabic ? "اسم العائلة" : "Last name"} <span className="text-red-500">*</span>
              </label>
              <input
                placeholder={isArabic ? "اسم عائلتك" : "Your last name"}
                className={`mt-1 w-full border rounded px-3 py-2 ${formErrors.lastName ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : ""}`}
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); if (formErrors.lastName) setFormErrors((p) => ({ ...p, lastName: undefined })); }}
              />
              {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
            </div>
          </div>

          {/* Email & Country */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                {isArabic ? "البريد الإلكتروني" : "Email address"} <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <FaEnvelope className={`absolute ${isArabic ? "right-3" : "left-3"} top-3 text-gray-400`} />
                <input
                  placeholder={isArabic ? "بريدك الإلكتروني" : "Your email"}
                  className={`w-full border rounded px-3 py-2 ${isArabic ? "pr-10" : "pl-10"} ${formErrors.email ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : ""}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors((p) => ({ ...p, email: undefined })); }}
                />
              </div>
              {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">
                {isArabic ? "الدولة" : "Country"} <span className="text-red-500">*</span>
              </label>
              <select
                className={`mt-1 w-full border rounded px-3 py-2 ${formErrors.country ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : ""}`}
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); if (formErrors.country) setFormErrors((p) => ({ ...p, country: undefined })); }}
              >
                <option value="">{isArabic ? "دولتك" : "Your country"}</option>
                {displayCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {formErrors.country && <p className="mt-1 text-xs text-red-500">{formErrors.country}</p>}
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

            {/* <button
              onClick={handleDownloadPDF}
              className="border px-2 py-1 rounded text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <FaDownload /> {isArabic ? "تحميل PDF" : "Download PDF"}
            </button> */}
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

            <div className="flex flex-col gap-3">
              <span className="font-semibold text-gray-700">{isArabic ? "الوجبات المضمنة" : "Included Meals"}</span>
              {!hotelDetail ? (
                <span className="text-sm text-gray-400 italic animate-pulse">
                  {isArabic ? "جاري تحميل الوجبات..." : "Loading meals..."}
                </span>
              ) : apiMeals.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {apiMeals.map((meal) => (
                    <div key={meal.id} className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={true}
                          // disabled={true}
                          readOnly
                          className="mt-0.5 w-4 h-4 accent-teal-600 cursor-not-allowed"
                        />
                        <p className="text-sm font-semibold text-gray-800">{meal.description}</p>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 ml-6">
                        <p className="flex justify-between">
                          <span className="font-semibold">{isArabic ? "البالغ" : "Adult"}:</span>
                          <span className="font-semibold"><Riyal /> {meal.unit_price}/night</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-semibold">{isArabic ? "الطفل" : "Child"}:</span>
                          <span className="font-semibold"><Riyal /> {meal.child_price}/night</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">
                  {isArabic ? "لا توجد وجبات متاحة" : "No meals available"}
                </span>
              )}
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

              {/* Meal Services */}
              <div className="flex justify-between">
                <span>{isArabic ? "خدمات الوجبات" : "Meal Services"}</span>
                <span className="flex items-center gap-1">
                  <img src="/Riyal_Black.png" alt="Riyal" className="w-4 h-4" />
                  {discountActive && disc?.applies_to === "rate_meals" && mealDiscountAmt > 0 ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through text-gray-400">{mealsTotal.toFixed(2)}</span>
                      <span className="text-green-700 font-semibold">{discountedMealsTotal.toFixed(2)}</span>
                    </span>
                  ) : (
                    <span>{mealsTotal === 0 ? "0.00" : mealsTotal.toFixed(2)}</span>
                  )}
                </span>
              </div>

              {/* Room */}
              <div className="flex justify-between">
                <span>{isArabic ? `الغرفة ${count} ${effectiveRoomName}` : `Room ${count} ${effectiveRoomName}`}</span>
                <span className="flex items-center gap-1">
                  {roomPriceLoading ? (
                    <span className="text-gray-400 text-xs animate-pulse">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
                  ) : discountActive && roomDiscountAmt > 0 ? (
                    <span className="flex items-center gap-1">
                      <Riyal />
                      <span className="line-through text-gray-400">{roomTotal.toFixed(2)}</span>
                      <span className="text-green-700 font-semibold">{discountedRoomTotal.toFixed(2)}</span>
                    </span>
                  ) : (
                    <><Riyal /> <span>{roomTotal.toFixed(2)}</span></>
                  )}
                </span>
              </div>

              {/* Discount badge */}
              {discountActive && totalDiscountAmt > 0 && (
                <div className="flex justify-between text-green-700 bg-green-50 px-2 py-1 rounded">
                  <span className="font-medium">
                    {isArabic ? "الخصم" : "Discount"}
                    {" "}
                    {disc?.type === "percentage"
                      ? `(${disc.value}%${disc.scope === "line_wise" ? (isArabic ? " لكل غرفة" : " per room") : ""})`
                      : `(${disc?.scope === "line_wise" ? (isArabic ? "لكل غرفة" : "per room") : (isArabic ? "إجمالي" : "total")})`
                    }
                    {disc?.applies_to === "rate_meals" ? (isArabic ? " — غرف وجبات" : " — rooms + meals") : ""}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    - <Riyal /> {totalDiscountAmt.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Grand Total */}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>{isArabic ? "الإجمالي" : "Total"}</span>
                <span className="flex items-center gap-1 bg-orange-100 px-2 rounded">
                  {roomPriceLoading ? (
                    <span className="text-gray-400 text-xs animate-pulse">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
                  ) : (
                    <><Riyal /> <span>{grandTotal.toFixed(2)}</span></>
                  )}
                </span>
              </div>

              {/* Amount to pay (after discount) */}
              <div className="flex justify-between font-semibold">
                <span>{isArabic ? "المبلغ الواجب دفعه" : "Amount to pay"}</span>
                <span className="flex items-center gap-1 bg-green-100 px-2 rounded">
                  {roomPriceLoading ? (
                    <span className="text-gray-400 text-xs animate-pulse">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
                  ) : (
                    <><Riyal /> <span>{payableAmount.toFixed(2)}</span></>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={handleContinueToPayment}
              disabled={submitting || loadingMethods}
              className="w-full mt-6 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded disabled:opacity-50"
            >
              {loadingMethods
                ? (isArabic ? "جاري تحميل طرق الدفع..." : "Loading payment methods…")
                : submitting
                ? (isArabic ? "جاري تأكيد الحجز..." : "Confirming booking…")
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

    {/* ── Payment Method Selection Modal ──────────────────────────── */}
    {showMethodModal && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
        dir={isArabic ? "rtl" : "ltr"}
        onClick={() => setShowMethodModal(false)}
      >
        <div
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="font-semibold text-lg text-gray-800">
              {isArabic ? "اختر طريقة الدفع" : "Select Payment Method"}
            </h3>
            <button
              onClick={() => setShowMethodModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Amount reminder */}
          <p className="px-5 pt-3 pb-1 text-sm text-gray-500">
            {isArabic ? "إجمالي المبلغ" : "Total"}{" "}
            <span className="font-semibold text-gray-800">
              <img src="/Riyal_Black.png" alt="SAR" className="inline w-4 h-4 mx-0.5" />
              {payableAmount.toFixed(2)}
            </span>
          </p>

          {/* Methods list */}
          <ul className="divide-y max-h-96 overflow-y-auto">
            {paymentMethods.map((m) => (
              <li key={m.id}>
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => handlePayWithMethod(m.id)}
                  disabled={submitting}
                >
                  {/* Logo */}
                  <img
                    src={m.imageUrl}
                    alt={m.nameEn}
                    className="w-12 h-8 object-contain rounded border border-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {/* Name */}
                  <span className="flex-1 font-medium text-gray-800">
                    {isArabic ? m.nameAr : m.nameEn}
                  </span>
                  {/* Amount (includes service charge) */}
                  <span className="text-sm text-gray-600 shrink-0">
                    {m.currencyIso} {m.totalAmount.toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-5 py-3 border-t text-center">
            <button
              onClick={() => setShowMethodModal(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}