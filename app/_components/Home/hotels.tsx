"use client";

import Image from "next/image";
import { LangContext } from "@/app/lang-provider";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Hotel = {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  rating: number;
};

const toArabicNumbers = (num: number) =>
  num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

export default function Hotels() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const router = useRouter();

  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels");
        const json = await res.json();

        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setHotelsList(
            json.data.map((h: Record<string, unknown>) => ({
              id: h.id as number,
              nameEn: (h.name as string) || "",
              nameAr: (h.name as string) || "", // Odoo returns single name; Arabic TBD
              price: (h.starting_price as number) || 0,
              imageUrl: h.logo
                ? `data:image/png;base64,${h.logo}`
                : "/hotel/hotel1.jpg",
              rating: (h.star_rating as number) || 0,
            }))
          );
          setLoading(false);
          return;
        }
      } catch {
        // API failed, fall through to fallback
      }

      // NOTE: localStorage fallback COMMENTED OUT for API testing
      // All hotel data should come from Odoo API only
      setLoading(false);
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white" dir={isArabic ? "rtl" : "ltr"}>
        <div className="max-w-[1440px] mx-auto p-6">
          <h2 className={`text-3xl font-bold mb-10 ${isArabic ? "font-arabic text-right" : ""}`}>
            {isArabic ? "عروض خاصة منّا لكم" : "Special offers from us to you"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 md:h-96 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hotelsList.length === 0) return null;

  return (
    <section className="w-full bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-[1440px] mx-auto p-6">

        {/* Title */}
        <h2 className={`text-3xl font-bold mb-10 ${isArabic ? "font-arabic text-right" : ""}`}>
          {isArabic ? "عروض خاصة منّا لكم" : "Special offers from us to you"}
        </h2>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hotelsList.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const ci = today.toISOString().split("T")[0];
                const co = tomorrow.toISOString().split("T")[0];
                router.push(`/RoomChoices?hotelId=${hotel.id}&checkIn=${ci}&checkOut=${co}&room=1&adult=1&children=0`);
              }}
              className={`relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg cursor-pointer
              group hover:shadow-2xl transition-all ${isArabic ? "text-right" : "text-left"}`}
            >
              <Image
                src={hotel.imageUrl}
                alt={isArabic ? hotel.nameAr : hotel.nameEn}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className={`absolute bottom-0 w-full p-3 text-white ${isArabic ? "right-0" : "left-0"}`}>
                <h3 className={`font-semibold text-sm ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? hotel.nameAr : hotel.nameEn}
                </h3>

                <p className={`text-lg opacity-80 ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? hotel.nameEn : hotel.nameAr}
                </p>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className={isArabic ? "font-arabic" : ""}>
                    {hotel.rating > 0
                      ? `★ ${hotel.rating.toFixed(1)}`
                      : (isArabic ? "بدون تقييمات ★" : "★ No ratings")}
                  </span>

                  <span className={`bg-[#003243] px-3 py-1 rounded text-sm flex items-center gap-1.5 ${isArabic ? "font-arabic" : ""}`}>
                    {isArabic ? (
                      <>
                        {toArabicNumbers(hotel.price)}
                        <Image src="/Riyal_White.png" alt="Riyal" width={14} height={14} />
                        / ليلة
                      </>
                    ) : (
                      <>
                        Night /
                        <Image src="/Riyal_White.png" alt="Riyal" width={14} height={14} />
                        {hotel.price}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
