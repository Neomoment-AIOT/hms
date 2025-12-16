"use client";

import { useState, FormEvent, useContext } from "react";
import { LangContext } from "@/app/lang-provider";
import Link from "next/link";

import { FaLinkedin, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function Footer() {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setStatus({ loading: false, success: true, error: "" });
      setEmail("");

      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: isArabic
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Try again.",
      });
    }
  };

  return (
    <footer
      className={`bg-black text-gray-300 px-6 py-12 md:px-16 ${isArabic ? "font-arabic" : ""
        }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Quick Links (uses Link) */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "روابط سريعة" : "Quick Links"}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:text-white">
                {isArabic ? "اتصل بنا" : "Contact Us"}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                {isArabic ? "معلومات عنا" : "About Us"}
              </Link>
            </li>
            <li>
              <Link href="/hotel" className="hover:text-white">
                {isArabic ? "الفنادق" : "Hotels"}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white">
                {isArabic ? "المدونات" : "Blogs"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "معلومات التواصل" : "Contact Information"}
          </h3>
          <ul className="space-y-2">
            <li>
              {isArabic ? (
                <>
                  الهاتف: <span dir="ltr">+966 9200 10417</span>
                </>
              ) : (
                "Phone: +966 9200 10417"
              )}
            </li>
            <li>
              {isArabic ? (
                <>
                  البريد: <span dir="ltr">marketing@alrefaa.co</span>
                </>
              ) : (
                "Email: marketing@alrefaa.co"
              )}
            </li>
            <li>
              {isArabic ? (
                <>
                  الموقع: العزيزية، مكة، السعودية
                </>
              ) : (
                "Location: Al Azizyah, Makkah, Saudia"
              )}
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "السياسات" : "Policies"}
          </h3>
          <ul className="space-y-2">
            <li>{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</li>
            <li>{isArabic ? "سياسة الاسترجاع" : "Refund Policy"}</li>
            <li>{isArabic ? "سياسة الإلغاء" : "Cancellation Policy"}</li>
            <li>{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="bg-gray-800 p-6 rounded-lg col-span-1 w-full">
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "اشترك" : "Subscribe"}
          </h3>

          <form onSubmit={handleSubscribe} className="flex mb-2">
            <input
              type="email"
              suppressHydrationWarning
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={isArabic ? "عنوان البريد الإلكتروني" : "Email address"}
              className={`
                w-full px-4 py-2 text-gray-900 bg-white focus:outline-none
                ${isArabic ? "rounded-r-md text-right" : "rounded-l-md"}
              `}
            />

            <button
              suppressHydrationWarning
              type="submit"
              disabled={status.loading}
              className={`
                bg-teal-600 text-white px-4 flex items-center justify-center 
                hover:bg-teal-700 disabled:opacity-50
                ${isArabic ? "rounded-l-md" : "rounded-r-md"}
              `}
            >
              {status.loading ? (
                <span className="text-xs">...</span>
              ) : isArabic ? (
                <FaArrowLeft size={18} />
              ) : (
                <FaArrowRight size={18} />
              )}
            </button>
          </form>

          <div className="min-h-[24px] mb-2">
            {status.success && (
              <p className="text-green-400 text-sm">
                {isArabic ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}
              </p>
            )}
            {status.error && (
              <p className="text-red-400 text-sm">{status.error}</p>
            )}
          </div>

          <p className="text-sm text-gray-400">
            {isArabic
              ? "هدفنا هو نقل التأثيرات الإيجابية من خلال تطوير طريقة تفاعل الشركات مع عملائها وفِرقها."
              : "Our goal is to translate the positive effects from revolutionizing how companies engage with their clients & their team."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8"></div>
      <div
        className={`
          max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center 
          text-sm text-gray-400 
          ${isArabic ? "text-right" : "text-left"}
        `}
      >
        {/* Copyright */}
        <p>
          {isArabic ? "جميع الحقوق محفوظة © 2025 الرفاع" : "Copyright © 2025 AL-Riffa"}
        </p>

        {/* Social Media Icons */}
        <div
          className={`
            flex mt-4 md:mt-0 
            ${isArabic ? "flex-row-reverse space-x-reverse space-x-6" : "space-x-4"}
          `}
        >
          <a className="text-white border border-gray-200 p-3 rounded-full"><FaLinkedin size={24} /></a>
          <a className="text-white border border-gray-200 p-3 rounded-full"><FaFacebook size={24} /></a>
          <a className="text-white border border-gray-200 p-3 rounded-full"><SiX size={24} /></a>
          <a className="text-white border border-gray-200 p-3 rounded-full"><FaInstagram size={24} /></a>
          <a className="text-white border border-gray-200 p-3 rounded-full"><FaWhatsapp size={24} /></a>
        </div>
      </div>
    </footer>
  );
}
