"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaUndo, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../_lib/adminStorage";

interface ReviewItem {
  id: number;
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

const colorOptions = [
  "bg-purple-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-orange-500",
  "bg-rose-500",
  "bg-indigo-600",
  "bg-green-600",
  "bg-red-600",
];

const defaultReviews: ReviewItem[] = [
  { id: 1, initial: "S", initialBg: "bg-purple-600", name: "Sami", dateEn: "12 Jan 2025", dateAr: "١٢ يناير ٢٠٢٥", stayTypeEn: "Couple", stayTypeAr: "زوجين", score: 9.0, textEn: "The location is great, everything around you is walking distance. Staff are friendly and helpful.", textAr: "الموقع رائع، كل شيء حولك على مسافة قريبة. الموظفون ودودون ومتعاونون." },
  { id: 2, initial: "A", initialBg: "bg-teal-600", name: "Ahmed", dateEn: "28 Dec 2024", dateAr: "٢٨ ديسمبر ٢٠٢٤", stayTypeEn: "Family", stayTypeAr: "عائلة", score: 8.0, textEn: "Very nice hotel, close to Al Haram. The staff was very kind and helped us with everything.", textAr: "فندق جميل جدًا، قريب من الحرم. كان الموظفون لطيفين جدًا وساعدونا في كل ما نحتاجه." },
  { id: 3, initial: "M", initialBg: "bg-blue-600", name: "Mohammed", dateEn: "15 Nov 2024", dateAr: "١٥ نوفمبر ٢٠٢٤", stayTypeEn: "Solo", stayTypeAr: "فردي", score: 9.0, textEn: "Excellent stay! The room was modern and well-equipped. The view from the upper floors is stunning.", textAr: "إقامة ممتازة! الغرفة كانت حديثة ومجهزة بشكل جيد. المنظر من الطوابق العليا رائع." },
  { id: 4, initial: "K", initialBg: "bg-orange-500", name: "Khalid", dateEn: "3 Oct 2024", dateAr: "٣ أكتوبر ٢٠٢٤", stayTypeEn: "Family", stayTypeAr: "عائلة", score: 10, textEn: "One of the best hotels we have stayed in. Everything was perfect from check-in to check-out.", textAr: "واحد من أفضل الفنادق التي أقمنا فيها. كل شيء كان مثاليًا من تسجيل الدخول إلى تسجيل الخروج." },
  { id: 5, initial: "F", initialBg: "bg-rose-500", name: "Fatima", dateEn: "20 Sep 2024", dateAr: "٢٠ سبتمبر ٢٠٢٤", stayTypeEn: "Couple", stayTypeAr: "زوجين", score: 8.0, textEn: "Good location and friendly staff. The room was a bit small but clean.", textAr: "موقع جيد وموظفون ودودون. الغرفة كانت صغيرة قليلًا لكنها نظيفة." },
];

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [editId, setEditId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setReviews(getAdminData(STORAGE_KEYS.GLOBAL_REVIEWS, defaultReviews));
  }, []);

  const handleSave = () => {
    setAdminData(STORAGE_KEYS.GLOBAL_REVIEWS, reviews);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(STORAGE_KEYS.GLOBAL_REVIEWS);
    setReviews(defaultReviews);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAdd = () => {
    const newReview: ReviewItem = {
      id: Date.now(),
      initial: "N",
      initialBg: "bg-teal-600",
      name: "New Guest",
      dateEn: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      dateAr: "تاريخ جديد",
      stayTypeEn: "Family",
      stayTypeAr: "عائلة",
      score: 8.0,
      textEn: "Enter review text...",
      textAr: "أدخل نص التقييم...",
    };
    setReviews((prev) => [...prev, newReview]);
    setEditId(newReview.id);
  };

  const updateReview = (id: number, field: keyof ReviewItem, value: string | number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guest Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage guest review entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500">
            <FaUndo size={12} /> Reset
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            <FaPlus size={12} /> Add Review
          </button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
            {editId === review.id ? (
              /* Edit Mode */
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input type="text" value={review.name} onChange={(e) => updateReview(review.id, "name", e.target.value)} placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.initial} maxLength={1} onChange={(e) => updateReview(review.id, "initial", e.target.value.toUpperCase())} placeholder="Initial" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" value={review.score} min={0} max={10} step={0.1} onChange={(e) => updateReview(review.id, "score", Number(e.target.value))} placeholder="Score" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.dateEn} onChange={(e) => updateReview(review.id, "dateEn", e.target.value)} placeholder="Date (EN)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.stayTypeEn} onChange={(e) => updateReview(review.id, "stayTypeEn", e.target.value)} placeholder="Stay Type (EN)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.stayTypeAr} onChange={(e) => updateReview(review.id, "stayTypeAr", e.target.value)} placeholder="Stay Type (AR)" dir="rtl" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                {/* Color picker */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Avatar Color</p>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button key={color} onClick={() => updateReview(review.id, "initialBg", color)} className={`w-8 h-8 rounded-full ${color} ${review.initialBg === color ? "ring-2 ring-offset-2 ring-teal-500" : ""}`} />
                    ))}
                  </div>
                </div>
                <textarea value={review.textEn} onChange={(e) => updateReview(review.id, "textEn", e.target.value)} placeholder="Review (EN)" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <textarea value={review.textAr} onChange={(e) => updateReview(review.id, "textAr", e.target.value)} placeholder="Review (AR)" dir="rtl" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <button onClick={() => setEditId(null)} className="text-sm text-teal-600 hover:underline">Done Editing</button>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 ${review.initialBg}`}>
                    {review.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-teal-600 text-white text-xs font-bold">
                        {review.score % 1 === 0 ? review.score.toFixed(0) : review.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{review.dateEn} · {review.stayTypeEn}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{review.textEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button onClick={() => setEditId(review.id)} className="p-2 text-gray-400 hover:text-teal-600"><FaEdit size={14} /></button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-gray-400 hover:text-red-500"><FaTrash size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Save All Changes</button>
        {saved && <span className="text-sm text-green-600">Saved successfully!</span>}
      </div>
    </div>
  );
}
