"use client";

import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

export default function AboutUs() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <section
      className={`w-full bg-white py-12 ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* Top Description */}
        <p
          className={`text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed ${
            isArabic ? "text-right" : "text-center"
          }`}
        >
          {isArabic
            ? `الرفاع هي منصة إلكترونية مخصصة لمساعدة حجاج العمرة في العثور على أفضل الفنادق
            بالقرب من المسجد النبوي في المدينة المنورة والمسجد الحرام في مكة المكرمة.
            سواء كنت تؤدي العمرة أو تزور المملكة العربية السعودية لرحلة روحية، فإن الرفاع
            تجعل عملية البحث عن مكان الإقامة المثالي وحجزه سهلة وموثوقة وبأسعار مناسبة.`
            : `AL-Riffa is a dedicated online platform designed to help Umrah pilgrims
          discover and book the best hotels near Al-Masjid An-Nabawi in Madinah
          and the Grand Mosque in Makkah. Whether you're performing Umrah or
          visiting Saudi Arabia for a spiritual journey, AL-Riffa makes finding
          and reserving your ideal accommodation simple, trustworthy, and
          affordable.`}
        </p>

        {/* Three Stats Boxes */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Box 1 */}
          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold">
              {isArabic ? "في جميع أنحاء العالم" : "Worldwide"}
            </h3>
            <p className="text-gray-700 font-medium">
              {isArabic ? "عملاء سعداء" : "Happy Customers"}
            </p>
            <p className="text-gray-500 text-sm">
              {isArabic ? "حجاج خدموا حول العالم" : "Pilgrims served worldwide"}
            </p>
          </div>

          {/* Box 2 */}
          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold">4.9/5</h3>
            <p className="text-gray-700 font-medium">
              {isArabic ? "تقييم العملاء" : "Customer Rating"}
            </p>
            <p className="text-gray-500 text-sm">
              {isArabic ? "بناءً على التقييمات الموثقة" : "Based on verified reviews"}
            </p>
          </div>

          {/* Box 3 — FIXED NUMBER 100+ */}
          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold">
              <span dir="ltr">100+</span> {/* prevents flipping */}
            </h3>
            <p className="text-gray-700 font-medium">
              {isArabic ? "فنادق شريكة" : "Partner Hotels"}
            </p>
            <p className="text-gray-500 text-sm">
              {isArabic ? "في مكة المكرمة والمدينة المنورة" : "Across Makkah and Madinah"}
            </p>
          </div>
        </div>

        {/* Goals – Mission – Vision */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Goals */}
          <div className="border rounded-xl p-6 text-center">
            <h3 className="text-teal-900 font-semibold text-lg mb-2">
              {isArabic ? "أهدافنا" : "Our Goals"}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {isArabic
                ? `توفر الرفاع للحجاج فنادق موثوقة بالقرب من المسجد الحرام والمسجد النبوي 
                بأسعار شفافة وخدمة موثوقة وتجربة حجز سلسة — مما يضمن الراحة وطمأنينة النفس 
                ليتمكنوا من التركيز على رحلتهم الروحية.`
                : `AL-Riffa offers pilgrims verified hotels near Al-Masjid al-Haram
              and Al-Masjid an-Nabawi with transparent pricing, reliable service,
              and a seamless booking experience — ensuring comfort and peace of mind
              so they can focus on their spiritual journey.`}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-teal-900 text-white rounded-xl p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">
              {isArabic ? "مهمتنا" : "Mission"}
            </h3>
            <p className="text-sm leading-relaxed">
              {isArabic
                ? `تبسيط وتعزيز الرحلة الروحية لحجاج العمرة من خلال تقديم تجربة حجز فنادق
                سلسة وموثوقة وبأسعار مناسبة بالقرب من المواقع المقدسة في مكة المكرمة والمدينة المنورة.`
                : `To simplify and enhance the spiritual journey of Umrah pilgrims by
              providing a seamless, trustworthy, and affordable hotel booking
              experience near the holy sites of Makkah and Madinah.`}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-black text-white rounded-xl p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">
              {isArabic ? "رؤيتنا" : "Vision"}
            </h3>
            <p className="text-sm leading-relaxed">
              {isArabic
                ? `أن نكون المنصة الإلكترونية الأكثر ثقة وتفضيلًا للحجاج حول العالم، من خلال
                ربطهم بإقامات عالية الجودة وضيافة مميزة تكمل رحلتهم المقدسة.`
                : `To become the most trusted and preferred online platform for pilgrims
              worldwide, connecting them with quality accommodations and exceptional
              hospitality that complement their sacred journey.`}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
