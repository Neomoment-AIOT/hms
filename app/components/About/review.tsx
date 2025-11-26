"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  text: string;
  subtitle: string;
  image: string;
}

const testimonials: Testimonial[] = [
  { name: "Aliza", text: "All of the staff are excellent...", subtitle: "Stayed with family", image: "/ReviewUser/1.png" },
  { name: "Asim", text: "The entire staff is outstanding...", subtitle: "Stayed with family", image: "/ReviewUser/2.png" },
  { name: "Zaib", text: "All of the staff are excellent", subtitle: "Stayed with family", image: "/ReviewUser/3.jpg" },
  { name: "Anvar", text: "Great service...", subtitle: "Stayed with family", image: "/ReviewUser/1.png" },
  { name: "Maaz", text: "Very polite staff...", subtitle: "Stayed with family", image: "/ReviewUser/2.png" },
  { name: "Adam", text: "Good experience...", subtitle: "Stayed with family", image: "/ReviewUser/3.jpg" },
];

export default function Review() {
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
        
        {/* Slider Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {groups.map((group, slideIndex) => (
              <div key={slideIndex} className="min-w-full flex justify-between items-stretch">
                
                {group.map((item, i) => (
                  <div key={i} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-6 flex">
                    <div className="bg-white shadow rounded-xl p-6 w-full flex flex-col justify-between">
                      <p className="text-gray-700 leading-relaxed mb-4">{item.text}</p>

                      <div className="flex mt-3 text-yellow-400 mb-3">★★★★★</div>

                      <div className="flex items-center gap-3 mt-2">
                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-full" />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
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
