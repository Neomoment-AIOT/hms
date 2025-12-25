"use client";

import { useState, useContext } from "react";
import { LangContext } from "@/app/lang-provider";
import PhotosPage from "./photos";
import Review from "../About/review";
import Amenities from "../Hotel/amenities";
import FAQ from "../About/faq";

const tabItems = [
  { id: "Photos", en: "Photos", ar: "الصور" },
  { id: "Room Choices", en: "Room Choices", ar: "خيارات الغرف" },
  { id: "Reviews", en: "Reviews", ar: "التقييمات" },
  { id: "Amenities", en: "Amenities", ar: "المرافق" },
  { id: "FAQs", en: "FAQs", ar: "الأسئلة الشائعة" },
];

export default function HotelTab() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [activeTab, setActiveTab] = useState<
    "Photos" | "Room Choices" | "Reviews" | "Amenities" | "FAQs"
  >("Room Choices");

  return (
    <div
      className={`max-w-7xl mx-auto mt-20 px-4 py-6 ${
        isArabic ? "font-arabic text-right" : "text-left"
      }`}
    >
      {/* Tabs */}
<div className="flex justify-center mb-6 text-sm">
  <div
    className={`relative flex bg-gray-100 rounded-t-lg overflow-hidden border
      ${isArabic ? "flex-row-reverse" : "flex-row"}
    `}
  >
    {tabItems.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`relative px-6 py-2 transition-all duration-300 ease-out
            ${isActive
              ? "text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"}
          `}
        >
          {isArabic ? tab.ar : tab.en}

          {/* Animated underline */}
          {isActive && (
            <span
              className={`
                absolute bottom-0 left-0 w-full h-0.5 bg-teal-600
                transition-all duration-300 ease-out
              `}
            />
          )}
        </button>
      );
    })}
  </div>
</div>



      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "Photos" && <PhotosPage />}
        {activeTab === "Reviews" && <Review />}
        {activeTab === "Amenities" && <Amenities />}
        {activeTab === "FAQs" && <FAQ />}
      </div>
    </div>
  );
}
