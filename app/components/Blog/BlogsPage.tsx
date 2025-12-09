"use client";

import Link from "next/link";
import { useContext } from "react";
import { LangContext } from "@/app/lang-provider";

export default function BlogsPage() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  const blogs = [
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

  return (
    <section
      className={`bg-[#f8fafb] py-10 ${ar ? "direction-rtl text-right" : ""}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 space-y-10">

        {blogs.map((b) => (
          <article
            key={b.slug}
            className={`bg-white rounded-md shadow-sm flex gap-6 items-start p-6 
              ${ar ? "flex-row-reverse text-right" : "text-left"}`}
          >

            {/* Image */}
            <img
              src={b.image}
              alt="blog"
              className="w-48 h-36 object-cover rounded-md"
            />

            {/* Content */}
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${ar ? "font-arabic" : ""}`}>
                {ar ? b.titleAr : b.titleEn}
              </h2>

              <p className={`text-gray-600 mt-2 ${ar ? "font-arabic" : ""}`}>
                {ar ? b.descriptionAr : b.descriptionEn}
              </p>

              <div
                className={`flex items-center gap-6 text-sm mt-3 
                  ${ar ? "flex-row-reverse" : ""}`}
              >

                <span className={ar ? "font-arabic" : ""}>
                  <strong>{ar ? "التاريخ:" : "Date:"}</strong>{" "}
                  <span className="text-emerald-700">{b.date}</span>
                </span>

                <span className={ar ? "font-arabic" : ""}>
                  <strong>{ar ? "الوقت:" : "Time:"}</strong>{" "}
                  <span className="text-emerald-700">{b.time}</span>
                </span>

                <span className={ar ? "font-arabic" : ""}>
                  <strong>{ar ? "التعليقات:" : "Comments:"}</strong>{" "}
                  <span className="text-emerald-700">{b.comments}</span>
                </span>

              </div>

              <Link href={`/blog/${b.slug}`} className="inline-block">
                <button
                  className={`mt-4 bg-linear-to-r from-[#1F8593] to-[#052E39] 
                    px-6 py-2 text-white font-semibold rounded-md cursor-pointer 
                    ${ar ? "font-arabic" : ""}`}
                >
                  {ar ? "اقرأ المزيد..." : "Learn More..."}
                </button>
              </Link>

            </div>
          </article>
        ))}

      </div>
    </section>
  );
}