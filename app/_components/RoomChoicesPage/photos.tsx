"use client";

import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

const fallbackImages = [
  "/Hotel_Room/deluxeroom.jpeg",
  "/Hotel_Room/familyroom.jpeg",
  "/Hotel_Room/guestroom.jpeg",
  "/Hotel_Room/luxuryroom.jpeg",
  "/Hotel_Room/dinings.jpeg",
  "/Hotel_Room/studiosuite.jpeg",
];

type PhotosProps = {
  hotelName?: string;
  roomImages?: string[];
};

export default function Photos({ hotelName, roomImages }: PhotosProps) {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const images = roomImages && roomImages.length > 0 ? roomImages : fallbackImages;
  const displayName = hotelName || (isArabic ? "فندقنا" : "Our Hotel");

  return (
    <section
      className={`w-full bg-white pt-12 pb-12 sm:pt-16 ${isArabic ? "rtl font-arabic" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {displayName}
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
            {isArabic
              ? "اختبر الأجواء التي ستجعلك ترغب في الإقامة كلما صادفت فندقنا"
              : "Experience the vibe that will coerce you to stay at whenever you come across our hotel"}
          </p>
        </div>

        {/* Photos Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={src}
                  alt={`${displayName} photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                  unoptimized={src.startsWith("data:")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
