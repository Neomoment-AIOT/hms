"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinIcon, StarIcon } from "lucide-react";
import { LangContext } from "@/app/lang-provider";

type Hotel = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  location: string;
};

const FALLBACK_IMAGES = [
  "/hotel/hotel1.jpg",  "/hotel/hotel2.jpeg", "/hotel/hotel3.jpeg",
  "/hotel/hotel4.jpeg", "/hotel/hotel5.jpeg", "/hotel/hotel6.jpeg",
  "/hotel/hotel7.jpeg", "/hotel/hotel8.jpeg", "/hotel/hotel9.jpeg",
  "/hotel/hotel10.jpeg","/hotel/hotel11.jpeg","/hotel/hotel12.jpeg",
  "/hotel/hotel13.jpeg","/hotel/hotel14.jpeg",
];

const toArabic = (n: number) =>
  n.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

export default function HotelsListSection() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";
  const router = useRouter();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/hotels")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setHotels(
            json.data.map((h: Record<string, unknown>, idx: number) => ({
              id: h.id as number,
              name: (h.name as string) || "",
              price: (h.starting_price as number) || 0,
              imageUrl: h.logo
                ? `data:image/png;base64,${h.logo}`
                : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
              rating: (h.star_rating as number) || 0,
              location: (h.location as string) || "",
            }))
          );
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (hotelId: number) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
    router.push(
      `/RoomChoices?hotelId=${hotelId}&checkIn=${today}&checkOut=${tomorrow}&room=1&adult=1&children=0`
    );
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-14" dir={ar ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-8 w-56 bg-gray-200 animate-pulse rounded mb-8 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Error / empty state ── */
  if (error || hotels.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-20 text-center" dir={ar ? "rtl" : "ltr"}>
        <p className={`text-gray-500 text-lg ${ar ? "font-arabic" : ""}`}>
          {ar ? "لا توجد فنادق متاحة حالياً." : "No hotels available at the moment."}
        </p>
      </section>
    );
  }

  /* ── Hotels grid ── */
  return (
    <section className="w-full bg-gray-50 py-14" dir={ar ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold text-gray-800 ${ar ? "font-arabic" : ""}`}>
            {ar ? "فنادقنا" : "Our Hotels"}
          </h2>
          <p className={`text-gray-500 mt-2 ${ar ? "font-arabic" : ""}`}>
            {ar
              ? "اختر من بين مجموعة من الفنادق المتميزة"
              : "Choose from a selection of premium hotels"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 w-full">
                <Image
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={hotel.imageUrl.startsWith("data:")}
                />
              </div>

              {/* Body */}
              <div className={`p-4 flex flex-col flex-1 ${ar ? "text-right font-arabic" : "text-left"}`}>

                {/* Rating */}
                <div className={`flex items-center gap-1 mb-1 ${ar ? "flex-row-reverse justify-end" : ""}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < hotel.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    {hotel.rating > 0 ? hotel.rating.toFixed(1) : (ar ? "لا تقييمات" : "No ratings")}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-gray-800 text-lg leading-snug mb-1">
                  {hotel.name}
                </h3>

                {/* Location */}
                {hotel.location && (
                  <div className={`flex items-center gap-1 text-sm text-gray-500 mb-3 ${ar ? "flex-row-reverse" : ""}`}>
                    <MapPinIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price + Book */}
                <div className={`flex items-center justify-between mt-3 ${ar ? "flex-row-reverse" : ""}`}>
                  <div>
                    <span className="text-xs text-gray-400">
                      {ar ? "يبدأ من" : "Starts from"}
                    </span>
                    <div className={`flex items-center gap-1 font-bold text-teal-700 text-lg ${ar ? "flex-row-reverse" : ""}`}>
                      <img src="/Riyal_Black.png" alt="SAR" className="w-4 h-4" />
                      <span>{ar ? toArabic(hotel.price) : hotel.price}</span>
                      <span className="text-sm font-normal text-gray-500">
                        {ar ? "/ ليلة" : "/ night"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(hotel.id)}
                    className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    {ar ? "احجز الآن" : "Book Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
