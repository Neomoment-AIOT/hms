"use client";
import Link from "next/link";
import { useEffect, useContext, useState as useReactState } from "react";
import { LangContext } from "@/app/lang-provider";

export default function BlogBanner() {
  const { lang } = useContext(LangContext);
  const isAr = lang === "ar";

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
        className={`relative z-10 text-white w-full px-3
          ${isAr ? "text-right pr-40" : "text-center max-w-6xl mx-auto scale-90"}`}
      >
        {/* Title */}
        <h1
          className={`text-4xl md:text-7xl font-semibold mb-2 ${
            isAr ? "font-arabic" : ""
          }`}
        >
          {isAr ? "الرفاع الرسمي" : "Al-Riffa Official"}
        </h1>

        {/* Breadcrumb */}
        <p
          className={`mb-3 text-3xl md:text-5xl ${
            isAr ? "font-arabic" : ""
          }`}
        >
          <Link href="/" className="hover:underline">
            {isAr ? "الرئيسية" : "Home"}
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:underline">
            {isAr ? "المدونات" : "Blogs"}
          </Link>
        </p>
      </div>
    </section>
  );
}