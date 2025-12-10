"use client";

import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

const rooms = [
  {
    nameEn: "Guest Rooms",
    nameAr: "غرف الضيوف",
    image: "/Hotel_Room/guestroom.jpeg",
  },
  {
    nameEn: "Family Rooms",
    nameAr: "الغرف العائلية",
    image: "/Hotel_Room/familyroom.jpeg",
  },
  {
    nameEn: "Dinnings",
    nameAr: "أماكن تناول الطعام",
    image: "/Hotel_Room/dinings.jpeg",
  },
  {
    nameEn: "Luxury Rooms",
    nameAr: "الغرف الفاخرة",
    image: "/Hotel_Room/luxuryroom.jpeg",
  },
  {
    nameEn: "Deluxe Rooms",
    nameAr: "غرف ديلوكس",
    image: "/Hotel_Room/deluxeroom.jpeg",
  },
  {
    nameEn: "Studio Suite",
    nameAr: "جناح استوديو",
    image: "/Hotel_Room/studiosuite.jpeg",
  },
];

export default function Room() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <section className="w-full bg-white pt-12 pb-12 sm:pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Description */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={`lg:text-lg sm:text-base leading-relaxed text-slate-700 mb-10 ${
              isArabic ? "font-arabic" : ""
            }`}
          >
            {isArabic
              ? "الرفاع هي منصة تربط حجاج العمرة بمجموعة واسعة من الفنادق في مكة المكرمة والمدينة المنورة. نقدم مجموعة متنوعة من خيارات الإقامة التي تناسب جميع الميزانيات والتفضيلات، بدءًا من الخيارات الاقتصادية وحتى الأجنحة الفاخرة. توفر منصتنا معلومات مفصلة عن كل فندق، بما في ذلك المرافق والتقييمات والصور، لمساعدتك في اتخاذ قرار مناسب. مع الرفاع، يمكنك بسهولة العثور على الفندق المثالي لرحلة العمرة الخاصة بك."
              : "Al-Riffa is a platform that connects Umrah pilgrims with a wide range of hotels in Makkah and Madinah. We offer a variety of accommodations to suit every budget and preference, from budget-friendly options to luxurious suites. Our platform provides detailed information about each hotel, including amenities, reviews, and photos, to help you make an informed decision. With Al-Riffa, you can easily find and book the perfect hotel for your Umrah journey."}
          </p>
        </div>

        {/* Room Cards */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.nameEn}
              className="flex flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={room.image}
                  alt={isArabic ? room.nameAr : room.nameEn}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  priority
                />
              </div>

              <div className="border-t border-sky-200 bg-white py-4 text-center">
                <span
                  className={`text-lg font-semibold tracking-wide text-slate-800 ${
                    isArabic ? "font-arabic" : ""
                  }`}
                >
                  {isArabic ? room.nameAr : room.nameEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
