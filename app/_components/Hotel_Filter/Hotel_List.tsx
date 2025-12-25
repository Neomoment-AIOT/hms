"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";
import { MapPinIcon } from "lucide-react"; // optional icon library, make sure lucide-react is installed

type Hotel = {
  id: number;
  name: string;
  arabicName: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  rooms: number;
  kaabaView?: boolean;
  breakfast?: boolean;
  freeWifi?: boolean;
};

type Props = {
  hotels: Hotel[];
};

// Helper function to convert numbers to Arabic-Indic digits
function toArabicNumber(num: number) {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

export default function HotelList({ hotels }: Props) {
  const { lang } = useContext(LangContext);
  const router = useRouter();

  if (hotels.length === 0)
    return (
      <p className={`${lang === "ar" ? "font-arabic text-right" : "text-left"} text-gray-500 mt-6`}>
        {lang === "ar" ? "لا توجد فنادق مطابقة للفلاتر المحددة." : "No hotels match selected filters."}
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-64 object-cover"
          />

          <div className={`p-4 ${lang === "ar" ? "font-arabic text-right" : "text-left"}`}>
            {/* Rating */}
            <div className="flex items-center mb-2 justify-start">
              <span className="text-yellow-400 text-lg mr-1">★</span>
              <span className="font-medium">{lang === "ar" ? toArabicNumber(hotel.rating) : hotel.rating}</span>
              <span className="text-gray-500 ml-2">
                {lang === "ar"
                  ? `(${toArabicNumber(hotel.reviews)}+ تقييم)`
                  : `(${hotel.reviews}+ Reviews)`}
              </span>
            </div>

            {/* Price */}
            <div className="mb-2 text-gray-700">
              <span className="text-sm">{lang === "ar" ? "يبدأ من " : "Starts from "}</span>
              <span className="font-bold text-lg">{lang === "ar" ? toArabicNumber(hotel.price) : hotel.price} SAR</span>
              <span className="text-sm">{lang === "ar" ? " / ليلة" : " / Night"}</span>
            </div>

            {/* Hotel Name */}
            <h3 className="font-semibold text-lg mb-2">
              {lang === "ar" ? hotel.arabicName : hotel.name}
            </h3>

            {/* Location and Rooms */}
            <div className="flex justify-between text-gray-500 text-sm mb-4 items-center">
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                {lang === "ar" ? "مكة المكرمة، السعودية" : hotel.location}
              </span>
              <span>
                {lang === "ar" ? toArabicNumber(hotel.rooms) : hotel.rooms} {lang === "ar" ? "غرف" : "Rooms"}
              </span>
            </div>

            {/* Button */}
            <button
            onClick={() => router.push("/RoomChoices")}
            className="w-full bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded-lg hover:opacity-90 transition">
              {lang === "ar" ? "اعرض غرفتك" : "See your room"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
