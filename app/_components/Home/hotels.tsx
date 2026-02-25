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
  { id: 9, nameEn: "Vivian Al-Jameeza Hotel", nameAr: "فندق فيفيان الجميزة", price: 150, imageUrl: "/hotel/hotel9.jpeg" },
  { id: 10, nameEn: "Vivian Al-Maabda Hotel", nameAr: "فندق فيفيان المعابدة", price: 142, imageUrl: "/hotel/hotel10.jpeg" },
  { id: 11, nameEn: "Al-Rafa Al-Aziza Hotel", nameAr: "فندق الرفاع العزيزية", price: 160, imageUrl: "/hotel/hotel11.jpeg" },
  { id: 12, nameEn: "Wahet Al-Refaa Hotel", nameAr: "فندق واحة الرفاع", price: 170, imageUrl: "/hotel/hotel12.jpeg" },
  { id: 13, nameEn: "Vivian Al-Aziza Hotel", nameAr: "فندق فيفيان العزيزية", price: 152, imageUrl: "/hotel/hotel13.jpeg" },
  { id: 14, nameEn: "Tariq Alhajrih Hotel", nameAr: "فندق طريق الهجره", price: 232, imageUrl: "/hotel/hotel14.jpeg" },
];

const toArabicNumbers = (num: number) =>
  num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

export default function Hotels() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const router = useRouter();

  const [hotelsList, setHotelsList] = useState(hotels);
  useEffect(() => {
    try {
      // Load disabled hotels map
      const disabledRaw = localStorage.getItem("admin_disabled_hotels");
      const disabledMap: Record<string, boolean> = disabledRaw ? JSON.parse(disabledRaw) : {};

      const stored = localStorage.getItem("admin_odoo_hotels");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHotelsList(
            parsed
              .filter((h: Record<string, unknown>) => !disabledMap[String(h.id)])
              .map((h: Record<string, unknown>) => ({
                id: h.id as number,
                nameEn: ((h.name as string) || (h.nameEn as string) || "") as string,
                nameAr: ((h.arabicName as string) || (h.nameAr as string) || "") as string,
                price: (h.price || 0) as number,
                imageUrl: ((h.image as string) || (h.imageUrl as string) || "/hotel/hotel1.jpg") as string,
              }))
          );
          return;
        }
      }
      // Fallback: filter hardcoded list by disabled map
      if (Object.keys(disabledMap).length > 0) {
        setHotelsList(hotels.filter((h) => !disabledMap[String(h.id)]));
      }
    } catch {}
  }, []);

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
              onClick={() => router.push(`/RoomChoices`)}
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
                    {isArabic ? "بدون تقييمات ★" : "★ No ratings"}
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