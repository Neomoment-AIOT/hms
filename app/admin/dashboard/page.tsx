"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaImage,
  FaNewspaper,
  FaTag,
  FaStar,
  FaHotel,
  FaDatabase,
  FaBuilding,
} from "react-icons/fa";
import { getLocalStorageUsageMB, STORAGE_KEYS, getAdminData, setAdminData } from "../_lib/adminStorage";
import { fetchHotelsFromOdoo, type OdooHotel } from "../_lib/odooApi";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  href: string;
}

export default function DashboardPage() {
  const [hotels, setHotels] = useState<OdooHotel[]>([]);
  const [parentName, setParentName] = useState<string>("");
  const [storageMB, setStorageMB] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [odooSource, setOdooSource] = useState<string>("");

  useEffect(() => {
    fetchHotelsFromOdoo().then((data) => {
      setHotels(data.hotels);
      setOdooSource(data.source);
      if (data.parentCompany) {
        setParentName(data.parentCompany.name);
        setAdminData(STORAGE_KEYS.ODOO_PARENT, data.parentCompany);
      }
      setAdminData(STORAGE_KEYS.ODOO_HOTELS, data.hotels);
    });

    setStorageMB(getLocalStorageUsageMB());

    const blogs = getAdminData<unknown[]>(STORAGE_KEYS.GLOBAL_BLOGS, []);
    setBlogCount(blogs.length || 3);

    const reviews = getAdminData<unknown[]>(STORAGE_KEYS.GLOBAL_REVIEWS, []);
    setReviewCount(reviews.length || 5);
  }, []);

  const stats: StatCard[] = [
    {
      label: "Hotel Branches",
      value: hotels.length,
      icon: FaHotel,
      color: "bg-teal-500",
      href: "/admin/hotels",
    },
    {
      label: "Blog Posts",
      value: blogCount,
      icon: FaNewspaper,
      color: "bg-blue-500",
      href: "/admin/global/blogs",
    },
    {
      label: "Reviews",
      value: reviewCount,
      icon: FaStar,
      color: "bg-amber-500",
      href: "/admin/global/reviews",
    },
    {
      label: "Storage Used",
      value: `${storageMB} MB`,
      icon: FaDatabase,
      color: "bg-purple-500",
      href: "#",
    },
  ];

  const quickActions = [
    {
      label: "Parent Company",
      icon: FaBuilding,
      href: "/admin/parent",
      desc: "Global website settings for " + (parentName || "Al Riffa"),
    },
    {
      label: "Manage Banner",
      icon: FaImage,
      href: "/admin/global/banner",
      desc: "Update homepage hero banner",
    },
    {
      label: "Manage Hotels",
      icon: FaHotel,
      href: "/admin/hotels",
      desc: "Per-hotel media, reviews & pricing",
    },
    {
      label: "Manage Blogs",
      icon: FaNewspaper,
      href: "/admin/global/blogs",
      desc: "Blog images & metadata",
    },
    {
      label: "Manage Offers",
      icon: FaTag,
      href: "/admin/global/offers",
      desc: "Offers section content",
    },
    {
      label: "Manage Reviews",
      icon: FaStar,
      href: "/admin/global/reviews",
      desc: "Guest review entries",
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Admin
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your hotel website content and media.
          {odooSource === "odoo" && (
            <span className="text-teal-600 ml-1">Connected to Odoo</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Storage Usage Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            localStorage Usage
          </span>
          <span className="text-sm text-gray-500">{storageMB} MB / ~5 MB</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storageMB > 4
                ? "bg-red-500"
                : storageMB > 3
                ? "bg-amber-500"
                : "bg-teal-500"
            }`}
            style={{ width: `${Math.min((storageMB / 5) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Images are stored as base64 in your browser. Data is browser-specific
          and will be lost if browser data is cleared.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <action.icon
                  size={18}
                  className="text-teal-600 group-hover:text-teal-700"
                />
                <span className="font-medium text-gray-900">
                  {action.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Hotels Overview */}
      {hotels.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Hotel Branches
            </h2>
            <Link
              href="/admin/hotels"
              className="text-sm text-teal-600 hover:underline"
            >
              View All ({hotels.length})
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Hotel
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">
                    Phone
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {hotels.slice(0, 8).map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {hotel.name}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">
                      {hotel.city || hotel.location}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                      {hotel.phone || "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/hotels/${hotel.id}`}
                        className="text-teal-600 hover:underline text-xs font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
