"use client";

import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

export default function FAQ() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <div
      className={`w-full bg-[#0F7C8F] py-20 ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-white rounded-2xl p-10 w-full shadow-md">

          {/* Title */}
          <h1
            className={`text-4xl font-bold mb-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {isArabic ? "الأسئلة الشائعة" : "FAQs"}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-gray-600 mb-10 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {isArabic
              ? "الأسئلة الشائعة حول ريتز كارلتون ريزيدنسز، شاطئ وايكيكي"
              : "FAQs for The Ritz-Carlton Residences, Waikiki Beach"}
          </p>

          <div className="space-y-10">

            {/* Q1 */}
            <div className={isArabic ? "text-right pr-4" : "text-left"}>
              <h3 className="font-semibold text-lg">
                {isArabic
                  ? "ما هي مواعيد تسجيل الوصول والمغادرة في ريتز كارلتون ريزيدنسز، شاطئ وايكيكي؟"
                  : "What are the check-in and check-out times at The Ritz-Carlton Residences, Waikiki Beach?"}
              </h3>

              <p className="text-gray-700 mt-2">
                {isArabic
                  ? "تسجيل الوصول يبدأ من الساعة 3:00 مساءً، وتسجيل المغادرة حتى الساعة 12:00 ظهرًا."
                  : "Check-in is from 3:00 PM, and check-out is until 12:00 PM."}
              </p>
            </div>

            {/* Q2 */}
            <div className={isArabic ? "text-right pr-4" : "text-left"}>
              <h3 className="font-semibold text-lg">
                {isArabic
                  ? "أين يقع فندق ريتز كارلتون ريزيدنسز، شاطئ وايكيكي؟"
                  : "Where is The Ritz-Carlton Residences, Waikiki Beach property located?"}
              </h3>

              <p className="text-gray-700 mt-2">
                {isArabic
                  ? "يقع الفندق في شاطئ وايكيكي، هونولولو."
                  : "The property is located in Waikiki Beach, Honolulu."}
              </p>
            </div>

            {/* Q3 */}
            <div className={isArabic ? "text-right pr-4" : "text-left"}>
              <h3 className="font-semibold text-lg">
                {isArabic
                  ? "ما هي خيارات تناول الطعام المتوفرة في الفندق؟"
                  : "What are the dining options available at the hotel?"}
              </h3>

              <p className="text-gray-700 mt-2">
                {isArabic
                  ? "يمكن للضيوف الاستمتاع بمجموعة متنوعة من خيارات الطعام بما في ذلك المأكولات المحلية والمطاعم الراقية والمقاهي البسيطة."
                  : "Guests can enjoy a range of dining options including local cuisine, fine dining, and casual cafes."}
              </p>
            </div>

            {/* Q4 */}
            <div className={isArabic ? "text-right pr-4" : "text-left"}>
              <h3 className="font-semibold text-lg">
                {isArabic
                  ? "ما هي أبرز المرافق المتوفرة في الفندق؟"
                  : "What are the top amenities available at the hotel?"}
              </h3>

              <p className="text-gray-700 mt-2">
                {isArabic
                  ? "تشمل المرافق مسبحًا على السطح، ومنتجعًا صحيًا، ومركزًا للياقة البدنية، وواي فاي مجاني."
                  : "Amenities include a rooftop pool, spa, fitness center, and free Wi-Fi."}
              </p>
            </div>

            {/* Q5 */}
            <div className={isArabic ? "text-right pr-4" : "text-left"}>
              <h3 className="font-semibold text-lg">
                {isArabic
                  ? "هل توجد غرف مخصصة للتدخين أو لغير المدخنين؟"
                  : "Are there rooms designated for smoking or non-smoking?"}
              </h3>

              <p className="text-gray-700 mt-2">
                {isArabic
                  ? "نعم، يوفر الفندق غرفًا مخصصة للتدخين وأخرى لغير المدخنين."
                  : "Yes, the hotel provides both smoking and non-smoking rooms."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}