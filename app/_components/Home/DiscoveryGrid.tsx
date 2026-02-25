"use client";

import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

interface GridItem {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  ctaEn: string;
  ctaAr: string;
  src: string;
}

const items: GridItem[] = [
  {
    titleEn: "Instant Benefits",
    titleAr: "مزايا فورية",
    descEn: "Enjoy exclusive member rates and privileges from your very first stay.",
    descAr: "استمتع بأسعار وامتيازات حصرية للأعضاء من إقامتك الأولى.",
    ctaEn: "DISCOVER MORE",
    ctaAr: "اكتشف المزيد",
    src: "/Hotel_Room/guestroom.jpeg",
  },
  {
    titleEn: "DISCOVERY Dollars",
    titleAr: "دولارات الاكتشاف",
    descEn: "Earn and redeem DISCOVERY Dollars across all our properties worldwide.",
    descAr: "اكسب واستبدل دولارات الاكتشاف في جميع فنادقنا حول العالم.",
    ctaEn: "DISCOVER MORE",
    ctaAr: "اكتشف المزيد",
    src: "/Hotel_Room/dinings.jpeg",
  },
  {
    titleEn: "Live Local",
    titleAr: "عِش كالسكان المحليين",
    descEn: "Immerse yourself in authentic local experiences curated just for you.",
    descAr: "انغمس في تجارب محلية أصيلة مُعدّة خصيصًا لك.",
    ctaEn: "DISCOVER MORE",
    ctaAr: "اكتشف المزيد",
    src: "/Hotel_Room/luxuryroom.jpeg",
  },
];

export default function DiscoveryGrid() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  return (
    <section
      className={`w-full ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row w-full h-screen md:h-[600px] overflow-hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/10 last:border-r-0"
          >
            {/* Image with zoom on hover */}
            <Image
              src={item.src}
              alt={isArabic ? item.titleAr : item.titleEn}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Dark overlay — lightens on hover */}
            <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/30" />

            {/* Bottom gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

            {/* Text content — positioned at bottom, slides up on hover */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-10 text-center">
              {/* Title — always visible, slides up on hover */}
              <h2 className="text-white text-2xl lg:text-3xl font-serif tracking-wider leading-tight drop-shadow-md transition-transform duration-500 ease-out translate-y-4 group-hover:-translate-y-2">
                {isArabic ? item.titleAr : item.titleEn}
              </h2>

              {/* Thin separator line */}
              <div className="w-10 h-px bg-white/60 mt-3 mb-3 transition-all duration-500 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0" />

              {/* Description — hidden by default, slides up on hover */}
              <p className="text-white/85 text-sm lg:text-base max-w-xs leading-relaxed transition-all duration-500 ease-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 delay-75">
                {isArabic ? item.descAr : item.descEn}
              </p>

              {/* CTA text — hidden by default, fades in on hover */}
              <span className="mt-4 text-white text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase border-b border-white/50 pb-1 transition-all duration-500 ease-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 delay-150 hover:border-white">
                {isArabic ? item.ctaAr : item.ctaEn}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
