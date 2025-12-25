"use client";

import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

const photos = [
  {
    titleEn: "Al-Refa Al-Saad Hotel",
    titleAr: "فندق الرفاع السعد",
    subtitleEn:
      "Experience the vibe that will coerce you to stay at whenever you come across our hotel",
    subtitleAr: "اختبر الأجواء التي ستجعلك ترغب في الإقامة كلما صادفت فندقنا",
    image: "/Hotel_Room/deluxeroom.jpeg",
  },
  { image: "/Hotel_Room/familyroom.jpeg" },
  { image: "/Hotel_Room/guestroom.jpeg" },
  { image: "/Hotel_Room/luxuryroom.jpeg" },
  { image: "/Hotel_Room/dinings.jpeg" },
  { image: "/Hotel_Room/studiosuite.jpeg" },
];

export default function Photos() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <section
      className={`w-full bg-white pt-12 pb-12 sm:pt-16 ${
        isArabic ? "rtl font-arabic" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {isArabic ? photos[0].titleAr : photos[0].titleEn}
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
            {isArabic ? photos[0].subtitleAr : photos[0].subtitleEn}
          </p>
        </div>

        {/* Photos Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={photo.image}
                  alt={`Hotel photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
