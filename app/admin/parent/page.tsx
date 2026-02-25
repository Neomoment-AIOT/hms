"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaImage,
  FaNewspaper,
  FaTag,
  FaStar,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";
import { getAdminData, STORAGE_KEYS } from "../_lib/adminStorage";
import { type OdooHotel } from "../_lib/odooApi";

export default function ParentCompanyPage() {
  const [parent, setParent] = useState<OdooHotel | null>(null);
  const [branchCount, setBranchCount] = useState(0);

  useEffect(() => {
    const p = getAdminData<OdooHotel | null>(STORAGE_KEYS.ODOO_PARENT, null);
    setParent(p);
    const hotels = getAdminData<OdooHotel[]>(STORAGE_KEYS.ODOO_HOTELS, []);
    setBranchCount(hotels.length);
  }, []);

  const sections = [
    {
      label: "Homepage Banner",
      desc: "Main website hero banner shared across all hotels",
      icon: FaImage,
      href: "/admin/global/banner",
      color: "bg-teal-500",
    },
    {
      label: "Blog Posts",
      desc: "Blog content for the parent company website",
      icon: FaNewspaper,
      href: "/admin/global/blogs",
      color: "bg-blue-500",
    },
    {
      label: "Special Offers",
      desc: "Global promotional offers across all hotels",
      icon: FaTag,
      href: "/admin/global/offers",
      color: "bg-amber-500",
    },
    {
      label: "Global Reviews",
      desc: "Overall company reviews shown on the main website",
      icon: FaStar,
      href: "/admin/global/reviews",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <Link
        href="/admin/hotels"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-4"
      >
        <FaArrowLeft size={12} />
        All Hotels
      </Link>

      {/* Parent Company Header */}
      <div className="bg-gradient-to-r from-[#052E39] to-[#1F8593] rounded-xl overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-center gap-5">
            {parent?.image && (
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <img
                  src={parent.image}
                  alt={parent.name}
                  className="w-14 h-14 object-contain rounded"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {parent?.name || "Parent Company"}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Parent Hotel Group &middot; Global Website Settings
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/70 text-sm">
                {parent?.location && (
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={11} />
                    {parent.location}
                  </span>
                )}
                {parent?.phone && (
                  <span className="flex items-center gap-1.5">
                    <FaPhone size={11} />
                    {parent.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FaBuilding size={11} />
                  {branchCount} hotel branches
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-700">
          This section manages <strong>global/shared content</strong> for the <strong>{parent?.name || "parent company"}</strong> booking website.
          Changes here apply across the entire site, not to individual hotels. To manage per-hotel media, go to{" "}
          <Link href="/admin/hotels" className="underline hover:no-underline">Hotel Branches</Link>.
        </p>
      </div>

      {/* Sections */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Global Website Content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
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
