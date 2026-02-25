"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaUndo, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import {
  getAdminData,
  setAdminData,
  removeAdminData,
  STORAGE_KEYS,
} from "../../../_lib/adminStorage";
import { type OdooHotel } from "../../../_lib/odooApi";

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

interface HotelRatings {
  overall: number;
  location: number;
  cleanliness: number;
  value: number;
  service: number;
  rooms: number;
  facilities: number;
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

const defaultRatings: HotelRatings = {
  overall: 8.5,
  location: 9.0,
  cleanliness: 8.5,
  value: 8.0,
  service: 8.5,
  rooms: 8.0,
  facilities: 7.5,
};

const defaultReviews: ReviewItem[] = [
  {
    id: 1,
    initial: "S",
    initialBg: "bg-purple-600",
    name: "Sami",
    dateEn: "12 Jan 2025",
    dateAr: "١٢ يناير ٢٠٢٥",
    stayTypeEn: "Couple",
    stayTypeAr: "زوجين",
    score: 9.0,
    textEn: "The location is great, everything around you is walking distance. Staff are friendly and helpful.",
    textAr: "الموقع رائع، كل شيء حولك على مسافة قريبة. الموظفون ودودون ومتعاونون.",
  },
  {
    id: 2,
    initial: "A",
    initialBg: "bg-teal-600",
    name: "Ahmed",
    dateEn: "28 Dec 2024",
    dateAr: "٢٨ ديسمبر ٢٠٢٤",
    stayTypeEn: "Family",
    stayTypeAr: "عائلة",
    score: 8.0,
    textEn: "Very nice hotel, close to Al Haram. The staff was very kind.",
    textAr: "فندق جميل جدًا، قريب من الحرم. كان الموظفون لطيفين جدًا.",
  },
];

export default function HotelReviewsPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const storageKey = STORAGE_KEYS.hotelReviews(hotelId);

  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [ratings, setRatings] = useState<HotelRatings>(defaultRatings);
  const [editId, setEditId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);

    const stored = getAdminData<{ reviews: ReviewItem[]; ratings: HotelRatings } | null>(storageKey, null);
    if (stored) {
      setReviews(stored.reviews);
      setRatings(stored.ratings);
    }
  }, [hotelId, storageKey]);

  const handleSave = () => {
    setAdminData(storageKey, { reviews, ratings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    removeAdminData(storageKey);
    setReviews(defaultReviews);
    setRatings(defaultRatings);
    setEditId(null);
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

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReview = (id: number, field: keyof ReviewItem, value: string | number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const ratingFields: { key: keyof HotelRatings; label: string }[] = [
    { key: "overall", label: "Overall" },
    { key: "location", label: "Location" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "value", label: "Value for Money" },
    { key: "service", label: "Service" },
    { key: "rooms", label: "Rooms" },
    { key: "facilities", label: "Facilities" },
  ];

  return (
    <div>
      <Link
        href={`/admin/hotels/${hotelId}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-4"
      >
        <FaArrowLeft size={12} />
        Back to {hotel?.name || "Hotel"}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Reviews & Ratings — {hotel?.name || `#${hotelId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage guest reviews and category ratings for this hotel.
          </p>
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

      {/* Ratings Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Category Ratings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ratingFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={ratings[key]}
                  onChange={(e) => setRatings((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  className="flex-1 accent-teal-600"
                />
                <span className={`text-sm font-bold min-w-[2.5rem] text-center px-2 py-0.5 rounded ${
                  ratings[key] >= 9 ? "bg-green-100 text-green-700" :
                  ratings[key] >= 7 ? "bg-teal-100 text-teal-700" :
                  ratings[key] >= 5 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {ratings[key].toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
            {editId === review.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input type="text" value={review.name} onChange={(e) => updateReview(review.id, "name", e.target.value)} placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.initial} maxLength={1} onChange={(e) => updateReview(review.id, "initial", e.target.value.toUpperCase())} placeholder="Initial" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" value={review.score} min={0} max={10} step={0.1} onChange={(e) => updateReview(review.id, "score", Number(e.target.value))} placeholder="Score" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.dateEn} onChange={(e) => updateReview(review.id, "dateEn", e.target.value)} placeholder="Date (EN)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.stayTypeEn} onChange={(e) => updateReview(review.id, "stayTypeEn", e.target.value)} placeholder="Stay Type (EN)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="text" value={review.stayTypeAr} onChange={(e) => updateReview(review.id, "stayTypeAr", e.target.value)} placeholder="Stay Type (AR)" dir="rtl" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
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
                    <p className="text-xs text-gray-400 mt-0.5">{review.dateEn} &middot; {review.stayTypeEn}</p>
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
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}
