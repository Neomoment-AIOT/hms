"use client";

import { useState, useContext, useEffect } from "react";
import { LangContext } from "@/app/lang-provider";

interface ReviewItem {
  initial: string;
  initialBg: string;
  name: string;
  dateEn: string;
  dateAr: string;
  stayTypeEn: string;
  stayTypeAr: string;
  score: number;
  textEn: string;
  textAr: string;
}

interface CategoryRating {
  labelEn: string;
  labelAr: string;
  score: number;
}

const categoryRatings: CategoryRating[] = [
  { labelEn: "Location", labelAr: "الموقع", score: 9.4 },
  { labelEn: "Cleanliness", labelAr: "النظافة", score: 8.7 },
  { labelEn: "Value for Money", labelAr: "القيمة مقابل المال", score: 8.2 },
  { labelEn: "Service", labelAr: "الخدمة", score: 8.9 },
  { labelEn: "Rooms", labelAr: "الغرف", score: 8.5 },
  { labelEn: "Facilities", labelAr: "المرافق", score: 8.8 },
];

const reviews: ReviewItem[] = [
  {
    initial: "S",
    initialBg: "bg-purple-600",
    name: "Sami",
    dateEn: "12 Jan 2025",
    dateAr: "١٢ يناير ٢٠٢٥",
    stayTypeEn: "Couple",
    stayTypeAr: "زوجين",
    score: 9.0,
    textEn:
      "The location is great, everything around you is walking distance. Staff are friendly and helpful. The room was clean and spacious. Highly recommend for anyone visiting.",
    textAr:
      "الموقع رائع، كل شيء حولك على مسافة قريبة. الموظفون ودودون ومتعاونون. الغرفة كانت نظيفة وواسعة. أنصح بشدة لأي شخص يزور.",
  },
  {
    initial: "A",
    initialBg: "bg-teal-600",
    name: "Ahmed",
    dateEn: "28 Dec 2024",
    dateAr: "٢٨ ديسمبر ٢٠٢٤",
    stayTypeEn: "Family",
    stayTypeAr: "عائلة",
    score: 8.0,
    textEn:
      "Very nice hotel, close to Al Haram. The staff was very kind and helped us with everything we needed. Breakfast buffet was good with variety of options.",
    textAr:
      "فندق جميل جدًا، قريب من الحرم. كان الموظفون لطيفين جدًا وساعدونا في كل ما نحتاجه. بوفيه الإفطار كان جيدًا مع خيارات متنوعة.",
  },
  {
    initial: "M",
    initialBg: "bg-blue-600",
    name: "Mohammed",
    dateEn: "15 Nov 2024",
    dateAr: "١٥ نوفمبر ٢٠٢٤",
    stayTypeEn: "Solo",
    stayTypeAr: "فردي",
    score: 9.0,
    textEn:
      "Excellent stay! The room was modern and well-equipped. The view from the upper floors is stunning. Will definitely come back again for my next visit.",
    textAr:
      "إقامة ممتازة! الغرفة كانت حديثة ومجهزة بشكل جيد. المنظر من الطوابق العليا رائع. سأعود بالتأكيد مرة أخرى في زيارتي القادمة.",
  },
  {
    initial: "K",
    initialBg: "bg-orange-500",
    name: "Khalid",
    dateEn: "3 Oct 2024",
    dateAr: "٣ أكتوبر ٢٠٢٤",
    stayTypeEn: "Family",
    stayTypeAr: "عائلة",
    score: 10,
    textEn:
      "One of the best hotels we have stayed in. Everything was perfect from check-in to check-out. The kids loved the pool area and the staff was very attentive.",
    textAr:
      "واحد من أفضل الفنادق التي أقمنا فيها. كل شيء كان مثاليًا من تسجيل الدخول إلى تسجيل الخروج. أحب الأطفال منطقة المسبح وكان الموظفون منتبهين جدًا.",
  },
  {
    initial: "F",
    initialBg: "bg-rose-500",
    name: "Fatima",
    dateEn: "20 Sep 2024",
    dateAr: "٢٠ سبتمبر ٢٠٢٤",
    stayTypeEn: "Couple",
    stayTypeAr: "زوجين",
    score: 8.0,
    textEn:
      "Good location and friendly staff. The room was a bit small but clean. The breakfast had a nice selection. Overall a pleasant experience for the price.",
    textAr:
      "موقع جيد وموظفون ودودون. الغرفة كانت صغيرة قليلًا لكنها نظيفة. الإفطار كان فيه تشكيلة جيدة. بشكل عام تجربة ممتعة مقابل السعر.",
  },
];

const filterTags = [
  { en: "All Guests", ar: "جميع الضيوف" },
  { en: "Cleanliness", ar: "النظافة" },
  { en: "Comfort", ar: "الراحة" },
  { en: "Staff", ar: "الموظفون" },
  { en: "Facilities", ar: "المرافق" },
  { en: "Location", ar: "الموقع" },
];

function getScoreLabel(score: number, isArabic: boolean): string {
  if (score >= 9) return isArabic ? "ممتاز+" : "Excellent+";
  if (score >= 8) return isArabic ? "ممتاز" : "Excellent";
  if (score >= 7) return isArabic ? "جيد جدًا" : "Very Good";
  if (score >= 6) return isArabic ? "جيد" : "Good";
  return isArabic ? "مقبول" : "Fair";
}

function RatingBar({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">
        {score}
      </span>
    </div>
  );
}

export default function Review() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const [activeFilter, setActiveFilter] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [reviewsList, setReviewsList] = useState(reviews);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_global_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsList(parsed);
        }
      }
    } catch {}
  }, []);

  const overallScore = 8.9;
  const totalReviews = reviewsList.length > 0 ? reviewsList.length * 25 : 128;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, reviewsList.length));
  };

  return (
    <section
      className={`w-full py-8 ${isArabic ? "font-arabic text-right" : "text-left"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {isArabic ? "التقييمات" : "Reviews"}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          {isArabic
            ? "تقييمات فندق كورتيارد ماريوت مكة المكرمة"
            : "Reviews for Courtyard by Marriott Makkah"}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ──────────── LEFT SIDEBAR ──────────── */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Overall Score */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-teal-600 text-white text-3xl font-bold mb-3">
                  {overallScore}
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {getScoreLabel(overallScore, isArabic)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isArabic
                    ? `بناءً على ${totalReviews} تقييم`
                    : `Based on ${totalReviews} reviews`}
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-5" />

              {/* Category Ratings */}
              <div className="space-y-4">
                {categoryRatings.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-600">
                        {isArabic ? cat.labelAr : cat.labelEn}
                      </span>
                    </div>
                    <RatingBar score={cat.score} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ──────────── RIGHT CONTENT ──────────── */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div
              className={`flex items-center justify-between mb-4 flex-wrap gap-3`}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "تقييمات الضيوف" : "Guest Reviews"}
              </h3>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue="recent"
                >
                  <option value="recent">
                    {isArabic ? "الأحدث" : "Most Recent"}
                  </option>
                  <option value="highest">
                    {isArabic ? "الأعلى تقييمًا" : "Highest Score"}
                  </option>
                  <option value="lowest">
                    {isArabic ? "الأقل تقييمًا" : "Lowest Score"}
                  </option>
                </select>
                <svg
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-400 ${
                    isArabic ? "left-2" : "right-2"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterTags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFilter(i)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    activeFilter === i
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isArabic ? tag.ar : tag.en}
                </button>
              ))}
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {reviewsList.slice(0, visibleCount).map((review, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  {/* Top row: avatar + info + score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center gap-3`}>
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${review.initialBg}`}
                      >
                        {review.initial}
                      </div>
                      {/* Name & meta */}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {isArabic ? review.dateAr : review.dateEn}
                          {" · "}
                          {isArabic ? review.stayTypeAr : review.stayTypeEn}
                        </p>
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                        {getScoreLabel(review.score, isArabic)}
                      </span>
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 text-white text-sm font-bold">
                        {review.score % 1 === 0
                          ? review.score.toFixed(0)
                          : review.score.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {isArabic ? review.textAr : review.textEn}
                  </p>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      {isArabic
                        ? "تقييم من عملاء المسافر"
                        : "Review from Almosafer customers"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More */}
            {visibleCount < reviewsList.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-2.5 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
                >
                  {isArabic ? "عرض المزيد من التقييمات" : "Show More Reviews"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
