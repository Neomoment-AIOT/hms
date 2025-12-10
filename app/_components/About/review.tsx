"use client";

import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { LangContext } from "@/app/lang-provider";

interface Testimonial {
  name: string;
  textEn: string;
  textAr: string;
  subtitleEn: string;
  subtitleAr: string;
  image: string;
}

export default function Review() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) setItemsPerSlide(3);
      else if (window.innerWidth >= 640) setItemsPerSlide(2);
      else setItemsPerSlide(1);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const testimonials: Testimonial[] = [
    {
      name: "Aliza",
      textEn: "All of the staff are excellent...",
      textAr: "جميع الموظفين ممتازون...",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/1.png",
    },
    {
      name: "Asim",
      textEn: "The entire staff is outstanding...",
      textAr: "جميع طاقم العمل رائعون...",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/2.png",
    },
    {
      name: "Zaib",
      textEn: "All of the staff are excellent",
      textAr: "جميع الموظفين ممتازون",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/3.jpg",
    },
    {
      name: "Anvar",
      textEn: "Great service...",
      textAr: "خدمة رائعة...",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/1.png",
    },
    {
      name: "Maaz",
      textEn: "Very polite staff...",
      textAr: "طاقم عمل مهذب للغاية...",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/2.png",
    },
    {
      name: "Adam",
      textEn: "Good experience...",
      textAr: "تجربة جيدة...",
      subtitleEn: "Stayed with family",
      subtitleAr: "أقام مع العائلة",
      image: "/ReviewUser/3.jpg",
    },
  ];

  const groups: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    groups.push(testimonials.slice(i, i + itemsPerSlide));
  }

  const totalSlides = groups.length;
  const [index, setIndex] = useState(0);

  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

  const handleNext = () =>
    setIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  return (
    <div className="w-full py-10 bg-gray-100 flex flex-col items-center">
      <div className="relative w-full max-w-6xl px-6">

        {/* SLIDER */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {groups.map((group, slideIndex) => (
              <div key={slideIndex} className="min-w-full flex justify-between">

                {group.map((item, i) => (
                  <div
                    key={i}
                    className="w-full sm:w-1/2 lg:w-1/3 px-4 py-6 flex"
                  >
                    <div
                      className={`bg-white shadow rounded-xl p-6 w-full flex flex-col 
                      ${isArabic ? "text-right font-cairo" : "text-left"}`}
                    >

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {isArabic ? item.textAr : item.textEn}
                      </p>

                      {/* Stars */}
                      <div
                        className={`flex text-yellow-400 mb-3 ${
                          isArabic ? "justify-end" : "justify-start"
                        }`}
                      >
                        ★★★★★
                      </div>

                      {/* USER ROW (RTL FIX) */}
                      <div
                        className={`flex items-center gap-3 mt-auto ${
                          isArabic ? "flex-row-reverse text-right" : "flex-row"
                        }`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />

                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {isArabic ? item.subtitleAr : item.subtitleEn}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            ))}
          </div>
        </div>

        {/* ARROWS */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
        >
          ‹
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
        >
          ›
        </button>

      </div>
    </div>
  );
}