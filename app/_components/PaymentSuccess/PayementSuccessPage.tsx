"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaDownload } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";
import { generateBookingPDF } from "@/app/utils/generateBookingPDF";
import { getPDFLabels } from "@/app/utils/pdfLabels";

/* ---------------- CONSTANTS ---------------- */

const Riyal = () => (
  <img src="/Riyal_Black.png" alt="Riyal" className="inline w-6 h-6" />
);

const MEAL_PRICES = {
  breakfast: 120,
  lunch: 150,
  dinner: 100,
} as const;

const mealKeys = ["breakfast", "lunch", "dinner"] as const;
type MealKey = (typeof mealKeys)[number];

/* ---------------- TYPES ---------------- */

type BookingData = {
  roomName: string;
  roomCount: number;
  checkIn: string;
  checkOut: string;
  meals: Record<MealKey, boolean>;
  totalAmount: number;
  guestName?: string;
  email?: string;
  roomPrice?: number;
};

/* ---------------- COMPONENT ---------------- */

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingData");
    if (storedData) setBookingData(JSON.parse(storedData));
  }, []);

  if (!bookingData) {
    return (
      <p className={`text-center mt-32 text-xl ${isArabic ? "font-arabic" : ""}`}>
        {isArabic ? "جارٍ التحميل..." : "Loading..."}
      </p>
    );
  }

  const { roomName, roomCount, checkIn, checkOut, meals, totalAmount, guestName, email } = bookingData;

  const handleDownloadPDF = () => {
    const labels = getPDFLabels(isArabic);
    const mealTotal = mealKeys.reduce(
      (sum, m) => sum + (meals[m] ? MEAL_PRICES[m] : 0),
      0
    );
    generateBookingPDF({
      bookingRef: "REF202503091738433773",
      guestName: guestName || "Guest",
      email: email || "N/A",
      roomName,
      roomCount,
      checkIn,
      checkOut,
      hotelName: "Raffah-2",
      hotelAddress: isArabic
        ? "بلعقيق، طريق الملك فهد، الرياض 13515، المملكة العربية السعودية"
        : "BeAl Aqiq, King Fahd Branch Rd, Riyadh 13515, Saudi Arabia",
      hotelPhone: "+966 920010417",
      rating: "3 / 5",
      meals,
      mealPrices: MEAL_PRICES,
      roomPrice: totalAmount - mealTotal,
      totalAmount,
      isArabic,
      labels,
    });
  };

  const selectedMeals = mealKeys.filter((meal) => meals[meal]);
  const mealTotal = mealKeys.reduce(
    (sum, meal) => sum + (meals[meal] ? MEAL_PRICES[meal] : 0),
    0
  );
  const roomPrice = totalAmount - mealTotal;

  return (
    <div
      className={`max-w-4xl mx-auto mt-10 md:mt-24 p-4 md:p-10 space-y-6 md:space-y-10 ${
        isArabic ? "font-arabic" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl md:text-4xl mt-10 font-semibold text-center">
        {isArabic ? "تم الدفع بنجاح" : "Payment Successful"}
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between text-base md:text-lg gap-2">
          <span className="font-semibold">{isArabic ? "ملخص الحجز" : "Booking Summary"}</span>
          <span className="text-gray-600">{checkIn} • {checkOut}</span>
        </div>

        <div className={`flex flex-col md:flex-row gap-6 items-center md:items-start ${isArabic ? "md:flex-row-reverse" : ""}`}>
          <img
            src="/Hotel_Room/luxuryroom.jpeg"
            className="w-full md:w-24 h-48 md:h-24 rounded-xl object-cover"
            alt="hotel"
          />
          <div className={`flex-1 text-center ${isArabic ? "md:text-right" : "md:text-left"}`}>
            <h4 className="font-semibold text-xl">{roomName}</h4>
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

        {/* Summary */}
        <div className="text-sm md:text-base space-y-4">
          <div className="flex justify-between gap-4">
            <span className="shrink-0">{isArabic ? "مرجع الحجز" : "Booking Ref."}</span>
            <span className="truncate">REF202503091738433773</span>
          </div>

          {/* Meal Summary */}
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <span>{isArabic ? "خدمات الوجبات" : "Meal Services"}</span>
            <span className="flex flex-wrap gap-2 md:gap-3">
              {selectedMeals.length ? selectedMeals.map((meal) => (
                <span
                  key={meal}
                  className="bg-purple-200 px-3 py-1 rounded-lg text-sm"
                >
                  {isArabic
                    ? meal === "breakfast" ? "إفطار" :
                      meal === "lunch" ? "غداء" : "عشاء"
                    : meal.charAt(0).toUpperCase() + meal.slice(1)
                  }
                </span>
              )) : (
                <span className="text-gray-400">{isArabic ? "لم يتم اختيار وجبة" : "No Meal Selected"}</span>
              )}
            </span>
          </div>

          <div>
            <span className="font-medium">{isArabic ? `الغرفة ${roomCount}: ${roomName}` : `Room ${roomCount}: ${roomName}`}</span>
            <span className="text-gray-500 block mt-1">
              {isArabic ? "البالغ: 1 | الأطفال: 1 | المجموع: 2" : "Adult: 1 | Children: 1 | Total Pax: 2"}
            </span>
          </div>
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="mt-6">
          <h4 className="font-semibold mb-4 text-xl">{isArabic ? "تفصيل السعر" : "Price Breakdown"}</h4>

          <div className="space-y-4 text-sm md:text-base">
            {mealKeys.map((meal) => (
              <div key={meal} className="flex justify-between">
                <span>{isArabic
                  ? meal === "breakfast" ? "إفطار" :
                    meal === "lunch" ? "غداء" : "عشاء"
                  : meal.charAt(0).toUpperCase() + meal.slice(1)
                }</span>
                <span className="font-medium"><Riyal /> {meals[meal] ? MEAL_PRICES[meal] : "0.00"}</span>
              </div>
            ))}

            <div className="flex justify-between">
              <span>{isArabic ? `الغرفة ${roomCount} ${roomName}` : `Room ${roomCount} ${roomName}`}</span>
              <span className="font-medium"><Riyal /> {roomPrice}</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>{isArabic ? "الإجمالي" : "Total"}</span>
              <span className="bg-orange-100 px-4 py-1 rounded-lg shrink-0"><Riyal /> {totalAmount}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>{isArabic ? "المبلغ الواجب دفعه" : "Amount to pay"}</span>
              <span className="bg-green-100 px-4 py-1 rounded-lg shrink-0"><Riyal /> {totalAmount}</span>
            </div>
          </div>

          <div className={`flex flex-col md:flex-row gap-4 md:gap-6 mt-10 ${isArabic ? "md:flex-row-reverse" : ""}`}>
            <button
              className="w-full bg-teal-700 text-white py-4 rounded-xl text-lg font-medium"
              onClick={() => router.push("/my-bookings")}
            >
              {isArabic ? "الذهاب إلى الحجز" : "Go to Booking"}
            </button>
            <button
              className="w-full bg-gray-200 py-4 rounded-xl text-lg font-medium"
              onClick={() => router.push("/hotel")}
            >
              {isArabic ? "استكشاف خدمات الفندق" : "Explore Hotel Services"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}