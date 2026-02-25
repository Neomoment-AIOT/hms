"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaImage,
  FaImages,
  FaBed,
  FaStar,
  FaDollarSign,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { getAdminData, STORAGE_KEYS, isHotelDisabled, setHotelDisabled } from "../../_lib/adminStorage";
import { type OdooHotel } from "../../_lib/odooApi";
import HotelSelector from "../../_components/HotelSelector";

export default function HotelMediaDashboard() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [hotels, setHotels] = useState<OdooHotel[]>([]);
  const [hotel, setHotel] = useState<OdooHotel | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const allHotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    setHotels(allHotels);
    const found = allHotels.find((h) => String(h.id) === hotelId);
    setHotel(found || null);
    setDisabled(isHotelDisabled(hotelId));
  }, [hotelId]);

  const handleToggle = () => {
    const newState = !disabled;
    setHotelDisabled(Number(hotelId), newState);
    setDisabled(newState);
  };

  const mediaSections = [
    {
      label: "Hotel Banner",
      desc: "Hero banner image for this hotel",
      icon: FaImage,
      href: `/admin/hotels/${hotelId}/banner`,
      color: "bg-teal-500",
    },
    {
      label: "Photo Gallery",
      desc: "Gallery images for this hotel",
      icon: FaImages,
      href: `/admin/hotels/${hotelId}/gallery`,
      color: "bg-blue-500",
    },
    {
      label: "Room Photos",
      desc: "Photos for each room type",
      icon: FaBed,
      href: `/admin/hotels/${hotelId}/rooms`,
      color: "bg-amber-500",
    },
    {
      label: "Reviews & Ratings",
      desc: "Guest reviews and rating scores for this hotel",
      icon: FaStar,
      href: `/admin/hotels/${hotelId}/reviews`,
      color: "bg-purple-500",
    },
    {
      label: "Pricing",
      desc: "Room pricing and rate configuration",
      icon: FaDollarSign,
      href: `/admin/hotels/${hotelId}/pricing`,
      color: "bg-rose-500",
    },
  ];

  return (
    <div>
      {/* Back link + Hotel Selector */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/hotels"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600"
        >
          <FaArrowLeft size={12} />
          All Hotels
        </Link>
        {hotels.length > 0 && (
          <HotelSelector hotels={hotels} currentHotelId={hotelId} />
        )}
      </div>

      {/* Disabled Warning Banner */}
      {disabled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-700">
              This hotel is currently disabled
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              It will not appear on the public website. All its content (banner, images, rooms, reviews, pricing) is hidden from visitors.
            </p>
          </div>
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shrink-0"
          >
            <FaToggleOn size={14} /> Enable Hotel
          </button>
        </div>
      )}

      {/* Hotel Info */}
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 ${disabled ? "opacity-60" : ""}`}>
        <div className={`relative h-48 ${disabled ? "grayscale" : ""}`}>
          <img
            src={hotel?.image || "/banner.jpg"}
            alt={hotel?.name || "Hotel"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl font-bold text-white">
              {hotel?.name || `Hotel #${hotelId}`}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {hotel?.location || "Location not set"}
            </p>
          </div>
        </div>

        {/* Hotel Details Bar */}
        {hotel && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
            {hotel.address && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt size={12} className="text-teal-600" />
                {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}
              </span>
            )}
            {hotel.phone && (
              <span className="flex items-center gap-1.5">
                <FaPhone size={12} className="text-teal-600" />
                {hotel.phone}
              </span>
            )}
            {hotel.email && (
              <span className="flex items-center gap-1.5">
                <FaEnvelope size={12} className="text-teal-600" />
                {hotel.email}
              </span>
            )}
            <span className="text-xs text-gray-400">
              Odoo ID: {hotel.id} &middot; Currency: {hotel.currency}
            </span>

            {/* Toggle inside details bar */}
            <button
              onClick={handleToggle}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ml-auto transition-colors ${
                disabled
                  ? "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
                  : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              }`}
            >
              {disabled ? (
                <><FaToggleOff size={14} /> Disabled</>
              ) : (
                <><FaToggleOn size={14} /> Enabled</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Media Sections */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Manage Hotel Content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaSections.map((section) => (
          <Link
            key={section.label}
            href={section.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-teal-300 transition-all group"
          >
            <div
              className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
            >
              <section.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {section.label}
            </h3>
            <p className="text-sm text-gray-500">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
