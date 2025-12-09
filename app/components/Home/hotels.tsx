"use client";

import Image from "next/image";
import { LangContext } from "@/app/lang-provider";
import { useContext } from "react";

type Hotel = {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
};

const hotels: Hotel[] = [
  { id: 1, nameEn: "Al-Refaa Ria Bakhsh Hotel", nameAr: "فندق الرفاع ريع بخش", price: 250, imageUrl: "/hotel/hotel1.jpg" },
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

const Hotels = () => {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <section className="p-6">

      {/* Title */}
      <h2 className={`text-3xl font-bold mb-10 ${isArabic ? "font-arabic text-right" : ""}`}>
        {isArabic ? "عروض خاصة منّا لكم" : "Special offers from us to you"}
      </h2>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 ${isArabic ? "direction-rtl" : ""
          }`}
      >
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`relative rounded-lg overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow h-80 md:h-96 ${isArabic ? "text-right" : "text-left"
              }`}
          >
            <Image
              src={hotel.imageUrl}
              alt={isArabic ? hotel.nameAr : hotel.nameEn}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-3 text-white">

              {/* Hotel Name */}
              <h3 className={`font-semibold text-sm ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? hotel.nameAr : hotel.nameEn}
              </h3>

              {/* Opposite language */}
              <p className={`text-lg opacity-80 ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? hotel.nameEn : hotel.nameAr}
              </p>

              {/* Ratings + Price */}
              <div
                className={`flex items-center mt-2 text-xs ${isArabic ? "justify-between flex-row-reverse" : "justify-between"
                  }`}
              >

                {/* Ratings */}
                <span className={`${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? "★ بدون تقييمات" : "★ No ratings"}
                </span>

                <span
                  className={`bg-[#003243] px-3 py-1 rounded text-white text-sm flex items-center gap-2 ${isArabic ? "font-arabic" : ""
                    }`}
                >
                  {isArabic ? (
                    <>
                      <span>ليلة /</span>
                      <Image
                        src="/Riyal_White.png"
                        alt="Riyal"
                        width={14}
                        height={14}
                      />
                      <span>{toArabicNumbers(hotel.price)}</span>
                    </>
                  ) : (
                    <>
                      Night /
                      <Image
                        src="/Riyal_White.png"
                        alt="Riyal"
                        width={14}
                        height={14}
                      />
                      {hotel.price}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hotels;