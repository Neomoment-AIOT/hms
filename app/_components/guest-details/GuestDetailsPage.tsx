"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaStar, FaDownload, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { format, addDays } from "date-fns";
import { LangContext } from "@/app/lang-provider";
import { generateBookingPDF } from "@/app/utils/generateBookingPDF";
import { getPDFLabels } from "@/app/utils/pdfLabels";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const roomsData = [
  { id: 1, name: "Deluxe Room", price: 240 },
  { id: 2, name: "Double Room", price: 260 },
  { id: 3, name: "Family Suite", price: 220 },
  { id: 4, name: "Hexagonal Room", price: 280 },
];

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
  const roomId = Number(searchParams.get("roomId"));
  const count = Number(searchParams.get("count")) || 1;

  const selectedRoom = roomsData.find((r) => r.id === roomId);

  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1));

  useEffect(() => {
    const inDate = searchParams.get("checkIn");
    const outDate = searchParams.get("checkOut");

    if (inDate) setCheckIn(new Date(inDate + "T00:00:00"));
    if (outDate) setCheckOut(new Date(outDate + "T00:00:00"));
  }, [searchParams]);

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
      bookingRef: "REF202503091738433773",
      guestName: `${firstName || "Guest"} ${lastName || ""}`.trim(),
      email: email || "N/A",
      roomName: selectedRoom?.name || "N/A",
      roomCount: count,
      checkIn: format(checkIn, "dd MMM yyyy"),
      checkOut: format(checkOut, "dd MMM yyyy"),
      hotelName: "Raffah-2",
      hotelAddress: isArabic
        ? "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية"
        : "BeAl Aqiq, King Fahd Branch Rd, Riyadh 13515, Saudi Arabia",
      hotelPhone: "+966 920010417",
      rating: "3 / 5",
      meals,
      mealPrices: MEAL_PRICES,
      roomPrice: roomTotal,
      totalAmount: grandTotal,
      isArabic,
      labels,
    });
  };

  const handleContinueToPayment = () => {
  const bookingData = {
    roomName: selectedRoom?.name,
    roomCount: count,
    checkIn: format(checkIn, "yyyy-MM-dd"),
    checkOut: format(checkOut, "yyyy-MM-dd"),
    meals,
    totalAmount: roomTotal + mealsTotal,
    guestName: `${firstName || "Guest"} ${lastName || ""}`.trim(),
    email: email || "N/A",
    roomPrice: roomTotal,
  };

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
                {countries.map((country) => (
                  <option key={country}>{country}</option>
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
              src="/Hotel_Room/luxuryroom.jpeg"
              className="w-16 h-16 rounded object-cover"
              alt="hotel"
            />

            <div className="flex-1">
              <h4 className="font-semibold">Raffah-2</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaStar className="text-yellow-400" /> 3 / 5
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
            <p>{isArabic ? "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية." : "BeAl Aqiq, RRAA8604, 8604 King Fahd Branch Rd, 3780., Riyadh 13515, Saudi Arabia."}</p>
          </div>

          {/* DETAILS */}
          <div className="text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">{isArabic ? "مرجع الحجز" : "Booking Ref."}</span>
              <span>REF202503091738433773</span>
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
              <p>{isArabic ? `الغرفة ${count}: ${selectedRoom?.name}` : `Room ${count}: ${selectedRoom?.name}`}</p>
              <p className="text-gray-500">{isArabic ? "البالغ: 1 | الأطفال: 1 | إجمالي العدد: 1" : "Adult: 1 | Children: 1 | Total Pax: 1"}</p>
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
                <span>{isArabic ? `الغرفة ${count} ${selectedRoom?.name}` : `Room ${count} ${selectedRoom?.name}`}</span>
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
  className="w-full mt-6 bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded"
>

              {isArabic ? "المتابعة للدفع" : "Continue to payment"}
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