"use client";

import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { LangContext } from "@/app/lang-provider";

export default function BlogsPage() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  const defaultBlogs = [
    {
      slug: "5-tips-to-find-the-best-hotels-in-makkah",
      titleEn: "5 Tips to find the best hotels in Makkah",
      titleAr: "5 نصائح للعثور على أفضل الفنادق في مكة",
      descriptionEn:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      descriptionAr:
        "يتطلب العثور على أفضل الفنادق في مكة بعض التخطيط الذكي لضمان الراحة والملاءمة والقيمة مقابل المال.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/Blogs/Blog.jpeg",
    },
    {
      slug: "best-hotels-in-makkah-2",
      titleEn: "Best Hotel in Makkah",
      titleAr: "أفضل فندق في مكة",
      descriptionEn:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      descriptionAr:
        "يتطلب العثور على أفضل الفنادق في مكة بعض التخطيط الذكي لضمان الراحة والملاءمة والقيمة مقابل المال.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/hotel/hotel2.jpeg",
    },
    {
      slug: "best-hotels-in-makkah-3",
      titleEn: "5 Tips to find the best hotels in Makkah",
      titleAr: "5 نصائح للعثور على أفضل الفنادق في مكة",
      descriptionEn:
        "Finding the best hotels in Makkah requires some smart planning to ensure comfort, convenience, and value for money.",
      descriptionAr:
        "يتطلب العثور على أفضل الفنادق في مكة بعض التخطيط الذكي لضمان الراحة والملاءمة والقيمة مقابل المال.",
      date: "12 Oct 2025",
      time: "12:00 pm",
      comments: 12,
      image: "/hotel/hotel3.jpeg",
    },
  ];

  const [blogsList, setBlogsList] = useState(defaultBlogs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_global_blogs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogsList(parsed);
        }
      }
    } catch {}
  }, []);

  return (
    <section
      className={`bg-[#f8fafb] py-10 min-h-screen ${ar ? "direction-rtl text-right" : "text-left"}`}
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto px-4 space-y-6 md:space-y-10">
        
        {blogsList.map((b) => (
          <article
            key={b.slug}
            className={`bg-white rounded-lg shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start p-4 md:p-6 transition-all hover:shadow-md
              ${ar ? "md:flex-row-reverse" : ""}`}
          >
            <div className="w-full md:w-48 h-56 md:h-40 shrink-0">
              <img
                src={b.image}
                alt="blog"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className={`text-xl md:text-2xl font-bold text-[#052E39] ${ar ? "font-arabic" : ""}`}>
                {ar ? b.titleAr : b.titleEn}
              </h2>

              <p className={`text-gray-600 mt-3 text-sm md:text-base leading-relaxed ${ar ? "font-arabic" : ""}`}>
                {ar ? b.descriptionAr : b.descriptionEn}
              </p>

              <div
                className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm mt-4 text-gray-500
                  ${ar ? "flex-row-reverse" : ""}`}
              >
                <span className={ar ? "font-arabic" : ""}>
                  <strong className="text-gray-700">{ar ? "التاريخ:" : "Date:"}</strong>{" "}
                  <span className="text-[#1F8593]">{b.date}</span>
                </span>

                <span className={ar ? "font-arabic" : ""}>
                  <strong className="text-gray-700">{ar ? "الوقت:" : "Time:"}</strong>{" "}
                  <span className="text-[#1F8593]">{b.time}</span>
                </span>

                <span className={ar ? "font-arabic" : ""}>
                  <strong className="text-gray-700">{ar ? "التعليقات:" : "Comments:"}</strong>{" "}
                  <span className="text-[#1F8593]">{b.comments}</span>
                </span>
              </div>

              <div className="mt-6">
                <Link href={`/blog/${b.slug}`} className="inline-block w-full md:w-auto">
                  <button
                    className={`w-full md:w-auto bg-linear-to-r from-[#1F8593] to-[#052E39] 
                      px-8 py-2.5 text-white font-semibold rounded-md hover:opacity-90 transition-opacity
                      ${ar ? "font-arabic" : ""}`}
                  >
                    {ar ? "اقرأ المزيد..." : "Learn More..."}
                  </button>
                </Link>
              </div>
            </div>
          </article>
        ))}

      </div>
    </section>
  );
}