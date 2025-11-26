"use client";

import { useEffect, useState as useReactState } from "react";

export default function HotelBanner() {
  const [headerHeight, setHeaderHeight] = useReactState(0);

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
      className="relative h-[420px] w-full flex items-center justify-center overflow-hidden transition-all duration-300"
      style={{ marginTop: `${headerHeight}px` }}
    >
      <img
        src="/banner.jpg"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 text-center text-white max-w-6xl w-full px-3 scale-90">
        <h1 className="text-3xl md:text-6xl font-semibold mb-2">
          Book Your Hotel With Ease Today
        </h1>
        <p className="mb-3 text-2xl md:text-2xl">
          Let us help you find the perfect stay for your Hajj or Umrah journey
        </p>
      </div>
    </section>
  );
}