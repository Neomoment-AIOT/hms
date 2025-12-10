"use client";

import { useEffect, useState as useReactState, useContext } from "react";
import { LangContext } from "@/app/lang-provider";

export default function HotelBanner() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [headerHeight, setHeaderHeight] = useReactState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);

    const handleResize = () => {
      if (header) setHeaderHeight(header.offsetHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative h-[420px] w-full flex items-center justify-center overflow-hidden transition-all duration-300"
      style={{ marginTop: `${headerHeight}px` }}
    >
      <img
        src="/banner.jpg"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div 
        className={`relative z-10 text-white w-full ${
          isArabic 
            ? "flex flex-col items-end px-3 sm:px-10 md:px-16 lg:px-28 xl:px-36"
            : "text-center max-w-6xl px-3 scale-90"
        }`}
      >
        
        {/* Title */}
        <h1
          className={`
            text-4xl md:text-5xl font-semibold mb-2
            ${isArabic ? "font-arabic text-right" : ""} // Removed 'w-full' as parent handles flex-end
          `}
          style={isArabic ? { direction: "rtl" } : {}}
        >
          {lang === "en"
            ? "Book Your Hotel With Ease Today."
            : "احجز فندقك بكل سهولة اليوم."}
        </h1>

        {/* Subtitle */}
        <p
          className={`
             mb-3 text-2xl md:text-2xl
            ${isArabic ? "font-arabic text-right" : ""} // Removed 'w-full'
            `}
          style={isArabic ? { direction: "rtl" } : {}}
        >
          {lang === "en"
            ? "Let us help you find the perfect stay for your Hajj or Umrah journey"
            : "دعنا نساعدك في العثور على الإقامة المثالية لرحلة الحج أو العمرة"}
        </p>
      </div>
    </section>
  );
}