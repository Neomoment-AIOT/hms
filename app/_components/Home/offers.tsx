"use client";

import Image from "next/image";
import { LangContext } from "@/app/lang-provider";
import { useContext, useState, useEffect } from "react";

type Hotel = {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
};

const hotels: Hotel[] = [
  { id: 1, nameEn: "Kudi Tower", nameAr: "كدي تاور", price: 250, imageUrl: "/hotel/hotel1.jpg" },
  { id: 2, nameEn: "Al-Refaa Al-Sadd Hotel", nameAr: "فندق الرفاع السد", price: 290, imageUrl: "/hotel/hotel2.jpeg" },
  { id: 3, nameEn: "Karam Al-Refaa Hotel", nameAr: "فندق كرم الرفاع", price: 190, imageUrl: "/hotel/hotel3.jpeg" },
  { id: 4, nameEn: "Barkat Al-Refaa Hotel", nameAr: "فندق بركة الرفاع", price: 224, imageUrl: "/hotel/hotel4.jpeg" },
  { id: 5, nameEn: "Nasmah Al-Khaiir Hotel", nameAr: "فندق نسمات الخير", price: 184, imageUrl: "/hotel/hotel5.jpeg" },
  { id: 6, nameEn: "Al-Fajr Al-Badee 1", nameAr: "الفجر البديع 1", price: 204, imageUrl: "/hotel/hotel6.jpeg" },
  { id: 7, nameEn: "Al-Refaa Ri'a Baksh Hotel", nameAr: "فندق الرفاع ريع بخش", price: 180, imageUrl: "/hotel/hotel7.jpeg" },
  { id: 8, nameEn: "Rawaabi Al-Salam Hotel", nameAr: "فندق روابي السلام", price: 154, imageUrl: "/hotel/hotel8.jpeg" },
];

const toArabicNumbers = (num: number) =>
  num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const Offers = () => {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [offersList, setOffersList] = useState(hotels);
  useEffect(() => {
    try {
      // Load disabled hotels map
      const disabledRaw = localStorage.getItem("admin_disabled_hotels");
      const disabledMap: Record<string, boolean> = disabledRaw ? JSON.parse(disabledRaw) : {};

      const stored = localStorage.getItem("admin_global_offers");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOffersList(
            parsed
              .filter((h: Record<string, unknown>) => {
                // Filter by odooId if present, otherwise by id
                const checkId = (h.odooId as number) || (h.id as number);
                return !disabledMap[String(checkId)];
              })
              .map((h: Record<string, unknown>) => ({
                id: h.id as number,
                nameEn: ((h.nameEn as string) || (h.name as string) || "") as string,
                nameAr: ((h.nameAr as string) || (h.arabicName as string) || "") as string,
                price: (h.price || 0) as number,
                imageUrl: ((h.imageUrl as string) || (h.image as string) || "/hotel/hotel1.jpg") as string,
              }))
          );
          return;
        }
      }
      // Fallback: filter hardcoded list by disabled map
      if (Object.keys(disabledMap).length > 0) {
        setOffersList(hotels.filter((h) => !disabledMap[String(h.id)]));
      }
    } catch {}
  }, []);

  return (
     <section className="w-full bg-gray-200" dir={isArabic ? "rtl" : "ltr"}>
          <div className="max-w-[1440px] mx-auto p-6">

            {/* Title */}
            <h2 className={`text-3xl font-bold mb-10 ${isArabic ? "font-arabic text-right" : ""}`}>
               {isArabic ? "فنادق تم اختيارها من أجلك" : "Hotels selected for you"}
            </h2>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {offersList.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`relative rounded-lg overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow h-80 md:h-96 ${isArabic ? "text-right" : "text-left"}`}
                >
                  <Image
                    src={hotel.imageUrl}
                    alt={isArabic ? hotel.nameAr : hotel.nameEn}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  <div className={`absolute bottom-0 ${isArabic ? "right-0" : "left-0"} w-full p-3 text-white`}>
                    <h3 className={`font-semibold text-sm ${isArabic ? "font-arabic" : ""}`}>
                      {isArabic ? hotel.nameAr : hotel.nameEn}
                    </h3>

                    <p className={`text-lg opacity-80 ${isArabic ? "font-arabic" : ""}`}>
                      {isArabic ? hotel.nameEn : hotel.nameAr}
                    </p>

                    <div className="flex items-center mt-2 text-xs justify-between">
                      <span className={`${isArabic ? "font-arabic text-right" : ""}`}>
                        {isArabic ? "بدون تقييمات ★" : "★ No ratings"}
                      </span>

                      <span
                        className={`bg-[#003243] px-3 py-1 rounded text-white text-sm flex items-center gap-1.5 ${isArabic ? "font-arabic" : ""}`}
                      >
                        {isArabic ? (
                          <>
                            <span>{toArabicNumbers(hotel.price)}</span>
                            <Image src="/Riyal_White.png" alt="Riyal" width={14} height={14} />
                            <span>/ ليلة</span>
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
};

export default Offers;