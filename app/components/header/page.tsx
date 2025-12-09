"use client";

import { useState, useContext } from "react";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";
import Link from "next/link";

export default function Header() {
  const { lang, setLang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const otherLanguage = lang === "en" ? "ar" : "en";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const router = useRouter();

  const selectLanguage = (l: "en" | "ar") => {
    setLang(l);
    setIsLangDropdownOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white fixed top-0 left-0 w-full z-50 shadow-md"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="bg-white rounded-full w-auto h-auto flex justify-center items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-16 object-cover" />
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-7 relative">

          <Link href="/" className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Home" : "الرئيسية"}
          </Link>

          <Link href="/about" className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "About Us" : "معلومات عنا"}
          </Link>

          <Link href="/hotel" className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Hotels" : "الفنادق"}
          </Link>

          <Link href="/contact" className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Contact Us" : "اتصل بنا"}
          </Link>

          <Link href="/blog" className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Blogs" : "مدونات"}
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center space-x-2 hover:text-gray-200 ${isArabic ? "font-arabic" : ""}`}
            >
              <FaGlobe size={16} />
              <span>{lang === "en" ? "English" : "العربية"}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-32">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${
                    otherLanguage === "ar" ? "font-arabic" : ""
                  }`}
                  onClick={() => selectLanguage(otherLanguage)}
                >
                  {otherLanguage === "en" ? "English" : "العربية"}
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <button
            onClick={() => router.push("/booking")}
            className={`border border-white px-3 py-1 rounded hover:bg-white hover:text-teal-700 transition ${
              isArabic ? "font-arabic" : ""
            }`}
          >
            {lang === "en" ? "Retrieve Booking" : "استرداد الحجز الخاص بي"}
          </button>

          <button
            onClick={() => router.push("/signin")}
            className={`bg-white text-teal-700 px-3 py-1 rounded hover:bg-gray-100 transition ${
              isArabic ? "font-arabic" : ""
            }`}
          >
            {lang === "en" ? "Sign In" : "تسجيل الدخول"}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-white text-2xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`
          fixed top-0 left-0 h-full bg-white text-black w-[90%]
          transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-40 shadow-lg
        `}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-lg font-semibold ${isArabic ? "font-arabic" : ""}`}>
            {lang === "en" ? "Menu" : "القائمة"}
          </h2>
          <button onClick={toggleMenu}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 p-6 text-lg">

          <Link href="/" onClick={toggleMenu} className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Home" : "الرئيسية"}
          </Link>

          <Link href="/about" onClick={toggleMenu} className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "About Us" : "معلومات عنا"}
          </Link>

          <Link href="/hotel" onClick={toggleMenu} className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Hotels" : "الفنادق"}
          </Link>

          <Link href="/contact" onClick={toggleMenu} className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Contact Us" : "اتصل بنا"}
          </Link>

          <Link href="/blog" onClick={toggleMenu} className={isArabic ? "font-arabic" : ""}>
            {lang === "en" ? "Blogs" : "مدونات"}
          </Link>

          {/* Mobile Language Dropdown */}
          <div>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center space-x-2 hover:text-teal-600 ${
                isArabic ? "font-arabic" : ""
              }`}
            >
              <FaGlobe size={18} />
              <span>{lang === "en" ? "English" : "العربية"}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="mt-2 bg-white text-black rounded shadow-lg w-32">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${
                    otherLanguage === "ar" ? "font-arabic" : ""
                  }`}
                  onClick={() => {
                    selectLanguage(otherLanguage);
                    toggleMenu();
                  }}
                >
                  {otherLanguage === "en" ? "English" : "العربية"}
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <button
            onClick={() => {
              router.push("/booking");
              toggleMenu();
            }}
            className={`border border-teal-600 px-4 py-2 rounded hover:bg-teal-600 hover:text-white transition ${
              isArabic ? "font-arabic" : ""
            }`}
          >
            {lang === "en" ? "Retrieve Booking" : "استرداد الحجز الخاص بي"}
          </button>

          <button
            onClick={() => {
              router.push("/signin");
              toggleMenu();
            }}
            className={`bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition ${
              isArabic ? "font-arabic" : ""
            }`}
          >
            {lang === "en" ? "Sign In" : "تسجيل الدخول"}
          </button>
        </nav>
      </div>
    </header>
  );
}