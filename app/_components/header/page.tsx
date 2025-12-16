"use client";

import { useState, useContext, useEffect } from "react";
import { FaBars, FaTimes, FaGlobe, FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";
import Link from "next/link";

import SignIn from "../signin/page";
import SignUp from "../signup/page";
import ForgotPassword from "../forgot_password/page";

type User = {
  name: string;
  email: string;
};

export default function Header() {
  const { lang, setLang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const otherLanguage = lang === "en" ? "ar" : "en";

  const router = useRouter();

  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Popup states
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  const selectLanguage = (l: "en" | "ar") => {
    setLang(l);
    setIsLangDropdownOpen(false);
  };

  const handleSignInSuccess = (u: User) => {
    setUser(u);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(u));
    }
    setIsSignInOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setIsUserDropdownOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header
        className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white fixed top-0 left-0 w-full z-50 shadow-md"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">
          {/* Logo */}
          <Link href="/">
            <div className="bg-white rounded-full flex justify-center items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-16 object-cover" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className={`hidden md:flex items-center space-x-7 ${isArabic ? "font-arabic" : ""}`}>
            <Link href="/">{lang === "en" ? "Home" : "الرئيسية"}</Link>
            <Link href="/about">{lang === "en" ? "About Us" : "معلومات عنا"}</Link>
            <Link href="/hotel">{lang === "en" ? "Hotels" : "الفنادق"}</Link>
            <Link href="/contact">{lang === "en" ? "Contact Us" : "اتصل بنا"}</Link>
            <Link href="/blog">{lang === "en" ? "Blogs" : "مدونات"}</Link>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2"
              >
                <FaGlobe />
                <span>{lang === "en" ? "English" : "العربية"}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-32">
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
                      otherLanguage === "ar" ? "font-arabic" : ""
                    }`}
                    onClick={() => selectLanguage(otherLanguage)}
                  >
                    {otherLanguage === "en" ? "English" : "العربية"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/booking")}
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-teal-700"
            >
              {lang === "en" ? "Retrieve Booking" : "استرداد الحجز الخاص بي"}
            </button>

            {/* User / Auth Buttons */}
            {!user ? (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="bg-white text-teal-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                {lang === "en" ? "Sign In" : "تسجيل الدخول"}
              </button>
            ) : (
              <div className="relative">
                <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                  <FaUserCircle size={28} />
                </button>

                {isUserDropdownOpen && (
                  <div
                    className={`absolute ${isArabic ? "left-0" : "right-0"} mt-2 bg-white text-black rounded shadow-lg w-56 p-4 ${isArabic ? "font-arabic" : ""}`}
                  >
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>

                    <button
                      onClick={() => router.push("/account")}
                      className="w-full mt-3 border px-3 py-1 rounded hover:bg-gray-100"
                    >
                      {lang === "en" ? "Account" : "الحساب"}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      {lang === "en" ? "Logout" : "تسجيل الخروج"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-2xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-full bg-white text-black w-[90%] transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-40 shadow-lg ${isArabic ? "font-arabic" : ""}`}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">{lang === "en" ? "Menu" : "القائمة"}</h2>
            <button onClick={toggleMenu}>
              <FaTimes size={22} />
            </button>
          </div>

          <nav className="flex flex-col space-y-4 p-6 text-lg">
            <Link href="/" onClick={toggleMenu}>{lang === "en" ? "Home" : "الرئيسية"}</Link>
            <Link href="/about" onClick={toggleMenu}>{lang === "en" ? "About Us" : "معلومات عنا"}</Link>
            <Link href="/hotel" onClick={toggleMenu}>{lang === "en" ? "Hotels" : "الفنادق"}</Link>
            <Link href="/contact" onClick={toggleMenu}>{lang === "en" ? "Contact Us" : "اتصل بنا"}</Link>
            <Link href="/blog" onClick={toggleMenu}>{lang === "en" ? "Blogs" : "مدونات"}</Link>

            {/* Language */}
            <div>
              <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="flex items-center gap-2">
                <FaGlobe size={18} />
                <span>{lang === "en" ? "English" : "العربية"}</span>
              </button>
              {isLangDropdownOpen && (
                <div className="mt-2 bg-white text-black rounded shadow-lg w-32">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    onClick={() => { selectLanguage(otherLanguage); toggleMenu(); }}
                  >
                    {otherLanguage === "en" ? "English" : "العربية"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => { router.push("/booking"); toggleMenu(); }}
              className="border border-teal-600 px-4 py-2 rounded hover:bg-teal-600 hover:text-white"
            >
              {lang === "en" ? "Retrieve Booking" : "استرداد الحجز الخاص بي"}
            </button>

            {/* Auth / User buttons */}
            {!user ? (
              <button
                onClick={() => { setIsSignInOpen(true); toggleMenu(); }}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                {lang === "en" ? "Sign In" : "تسجيل الدخول"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { router.push("/account"); toggleMenu(); }}
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                >
                  {lang === "en" ? "Account" : "الحساب"}
                </button>
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  {lang === "en" ? "Logout" : "تسجيل الخروج"}
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Popups */}
      {isSignInOpen && (
        <SignIn
          onClose={() => setIsSignInOpen(false)}
          openSignUp={() => { setIsSignInOpen(false); setIsSignUpOpen(true); }}
          openForgot={() => { setIsSignInOpen(false); setIsForgotOpen(true); }}
          onSuccess={handleSignInSuccess}
        />
      )}

      {isSignUpOpen && (
        <SignUp
          onClose={() => setIsSignUpOpen(false)}
          openSignIn={() => { setIsSignUpOpen(false); setIsSignInOpen(true); }}
        />
      )}

      {isForgotOpen && (
        <ForgotPassword
          onClose={() => setIsForgotOpen(false)}
          openSignIn={() => { setIsForgotOpen(false); setIsSignInOpen(true); }}
        />
      )}
    </>
  );
}
