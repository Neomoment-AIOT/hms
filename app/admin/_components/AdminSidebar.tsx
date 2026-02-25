"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaImage,
  FaNewspaper,
  FaTag,
  FaStar,
  FaHotel,
  FaBars,
  FaTimes,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import { useState } from "react";

const globalLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/admin/parent", label: "Parent Company", icon: FaBuilding },
  { href: "/admin/global/banner", label: "Banner", icon: FaImage },
  { href: "/admin/global/blogs", label: "Blogs", icon: FaNewspaper },
  { href: "/admin/global/offers", label: "Hotels Selected", icon: FaTag },
  { href: "/admin/global/reviews", label: "Reviews", icon: FaStar },
  { href: "/admin/global/pdf-labels", label: "PDF Labels", icon: FaFileAlt },
];

const hotelLinks = [
  { href: "/admin/hotels", label: "All Hotels", icon: FaHotel },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    if (href === "/admin/parent") return pathname === "/admin/parent";
    return pathname.startsWith(href);
  };

  const linkClasses = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive(href)
        ? "bg-[#1F8593] text-white"
        : "text-gray-300 hover:bg-[#0D4047] hover:text-white"
    }`;

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10">
        <div className="bg-white rounded-full p-1">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-cover" />
        </div>
        <div>
          <h2 className="text-white font-bold text-sm">Admin Panel</h2>
          <p className="text-gray-400 text-xs">Al Riffa Hotels</p>
        </div>
      </div>

      {/* Global Media */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Global / Website
        </p>
      </div>
      <nav className="px-2 space-y-1">
        {globalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={linkClasses(link.href)}
          >
            <link.icon size={16} />
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Hotel Management */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Hotel Branches
        </p>
      </div>
      <nav className="px-2 space-y-1">
        {hotelLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={linkClasses(link.href)}
          >
            <link.icon size={16} />
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#052E39] text-white p-2 rounded-lg shadow-lg"
      >
        <FaBars size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#052E39] z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={18} />
        </button>
        {navContent}
      </aside>

      {/* Sidebar — desktop */}
      <aside className="hidden lg:block w-64 bg-[#052E39] min-h-screen shrink-0">
        {navContent}
      </aside>
    </>
  );
}
