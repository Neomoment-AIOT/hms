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
      className={`bg-black text-gray-300 px-6 py-12 md:px-16 ${
        isArabic ? "font-arabic" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* LAYOUT FIX: 
          Using 'flex' with 'justify-between' instead of 'grid'. 
          This ensures columns are spaced based on the container width, 
          preventing long text in one column from 'crowding' the next one.
      */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-4">
        
        {/* Column 1: Quick Links */}
        <div className="min-w-[150px]">
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

        {/* Column 2: Contact Info */}
        <div className="min-w-[200px]">
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "معلومات التواصل" : "Contact Information"}
          </h3>
          <ul className="space-y-2">
            <li>
              {isArabic ? (
                <>الهاتف: <span dir="ltr">+966 9200 10417</span></>
              ) : (
                "Phone: +966 9200 10417"
              )}
            </li>
            <li>
              {isArabic ? (
                <>البريد: <span dir="ltr">marketing@alrefaa.co</span></>
              ) : (
                "Email: marketing@alrefaa.co"
              )}
            </li>
            <li>
              {isArabic ? (
                "الموقع: العزيزية، مكة، السعودية"
              ) : (
                "Location: Al Azizyah, Makkah, Saudia"
              )}
            </li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div className="min-w-[150px]">
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

        {/* Column 4: Subscribe */}
        <div className="bg-gray-800 p-6 rounded-lg w-full lg:w-auto lg:max-w-[320px]">
          <h3 className="text-white font-semibold mb-4">
            {isArabic ? "اشترك" : "Subscribe"}
          </h3>

          <form onSubmit={handleSubscribe} className="flex mb-2">
            <input
              type="email"
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

          <p className="text-sm text-gray-400 mt-4">
            {isArabic
              ? "هدفنا هو نقل التأثيرات الإيجابية من خلال تطوير طريقة تفاعل الشركات مع عملائها وفِرقها."
              : "Our goal is to translate the positive effects from revolutionizing how companies engage with their clients & their team."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>
          {isArabic ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} الرفاع` : `Copyright © ${new Date().getFullYear()} AL-Riffa*`}
        </p>

        <div className={`flex mt-4 md:mt-0 ${isArabic ? "flex-row-reverse space-x-reverse space-x-6" : "space-x-4"}`}>
          <a href="https://www.linkedin.com/company/al-refaa-al-omrani" className="text-white border border-gray-200 p-3 rounded-full">
            <FaLinkedin size={20} />
          </a>
          <a href="https://www.facebook.com/alrefaaforhotels" className="text-white border border-gray-200 p-3 rounded-full">
            <FaFacebook size={20} />
          </a>
          <a href="https://x.com/alrefaa_alomran" className="text-white border border-gray-200 p-3 rounded-full">
            <SiX size={20} />
          </a>
          <a href="https://www.instagram.com/alrefaamotels/" className="text-white border border-gray-200 p-3 rounded-full ">
            <FaInstagram size={20} />
          </a>
          <a href="https://wa.me/966920010417" target="_blank" rel="noopener noreferrer" className="text-white border border-gray-200 p-3 rounded-full ">
            <FaWhatsapp size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}