"use client";

import { useEffect, useContext, useState as useReactState } from "react";
import { LangContext } from "@/app/lang-provider";

export default function Label() {
  const [headerHeight, setHeaderHeight] = useReactState(0);
  const { lang } = useContext(LangContext);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    const handleResize = () => {
      if (header) setHeaderHeight(header.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className={`relative h-[420px] w-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
        lang === "ar" ? "font-arabic" : ""
      }`}
      style={{ marginTop: `${headerHeight}px` }}
    >
      <img
        src="/banner.jpg"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div 
        className={`relative z-10 text-white w-full ${
          lang === "ar" 
            ? "flex flex-col items-end px-3 sm:px-10 md:px-16 lg:px-28 xl:px-36"
            : "text-center px-3"
        }`}
      >
        
        {/* Title */}
        <h1
          className={`
            text-4xl md:text-7xl font-semibold mb-2
            ${lang === "ar" ? "font-arabic text-right" : ""}
          `}
          style={lang === "ar" ? { direction: "rtl" } : {}}
        >
          {lang === "en" ? "About Al-Riffa" : "عن نظام الرفاع "}
        </h1>

        {/* Subtitle */}
        <p
          className={`
             mb-3 text-4xl md:text-7xl
            ${lang === "ar" ? "font-arabic text-right" : ""}
            `}
          style={lang === "ar" ? { direction: "rtl" } : {}}
        >
          {lang === "en" ? "Hotel Management System" : "نظام إدارة الفنادق"}
        </p>
      </div>
    </section>
  );
}