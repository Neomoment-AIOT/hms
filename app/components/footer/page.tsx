"use client";

import { useState, useContext, FormEvent } from "react";
import { FaLinkedin, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";
import Link from "next/link";

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
        error: isArabic ? "حدث خطأ ما. حاول مرة أخرى." : "Something went wrong. Try again.",
      });
    }
  };

  return (
    <footer className="bg-black text-gray-300 px-6 py-12 md:px-16">

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Quick Links */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className={`text-white font-semibold mb-4 ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "روابط سريعة" : "Quick Links"}
          </h3>

          <ul className={`space-y-2 ${isArabic ? "text-right font-arabic" : "text-left"}`}>
            <li><Link href="/contact">{isArabic ? "اتصل بنا" : "Contact Us"}</Link></li>
            <li><Link href="/about">{isArabic ? "معلومات عنا" : "About Us"}</Link></li>
            <li><Link href="/hotel">{isArabic ? "الفنادق" : "Hotels"}</Link></li>
            <li><Link href="/blog">{isArabic ? "مدونات" : "Blogs"}</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className={`text-white font-semibold mb-4 ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "معلومات الاتصال" : "Contact Information"}
          </h3>

          <ul className={`space-y-2 ${isArabic ? "font-arabic text-right" : ""}`}>

            {/* PHONE NUMBER */}
            <li className={isArabic ? "flex gap-2 justify-end font-arabic" : ""}>
              {isArabic ? (
                <>
                  <span>+966 920010417</span>
                  <span> :الهاتف</span>
                </>
              ) : (
                <>Phone: +966 920010417</>
              )}
            </li>

            <li className={isArabic ? "flex gap-2 justify-end font-arabic" : ""}>
              {isArabic ? (
                <>
                  <span>marketing@alrefaa.co</span>
                  <span> :البريد الإلكتروني</span>
                </>
              ) : (
                <>Email: marketing@alrefaa.co</>
              )}
            </li>

            {/* LOCATION */}
            <li>
              {isArabic
                ? "الموقع: العزيزية، مكة المكرمة، السعودية"
                : "Location: Al Azizyah, Makkah, Saudia"}
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className={`text-white font-semibold mb-4 ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "السياسات" : "Policies"}
          </h3>

          <ul className={`space-y-2 ${isArabic ? "font-arabic text-right" : ""}`}>
            <li>{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</li>
            <li>{isArabic ? "سياسة استرداد الأموال" : "Refund Policy"}</li>
            <li>{isArabic ? "سياسة الإلغاء" : "Cancellation Policy"}</li>
            <li>{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className={`text-white font-semibold mb-4 ${isArabic ? "text-right font-arabic" : ""}`}>
            {isArabic ? "إشترك" : "Subscribe"}
          </h3>

          <form
            onSubmit={handleSubscribe}
            className={`flex mb-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* INPUT FIELD */}
            <input
              type="email"
              required
              value={email}
              placeholder={isArabic ? "عنوان البريد الإلكتروني" : "Email address"}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 text-gray-900 bg-white focus:outline-none
      ${isArabic ? "rounded-r-md text-right font-arabic" : "rounded-l-md"}
    `}
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={status.loading}
              className={`bg-teal-600 text-white px-4 flex items-center justify-center 
      hover:bg-teal-700 disabled:opacity-50
      ${isArabic ? "rounded-l-md" : "rounded-r-md"}
    `}
            >
              {status.loading ? "..." : isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </form>

          {/* Messages */}
          <div className="min-h-[24px] mb-2 text-right">
            {status.success && (
              <p className={`text-green-400 text-sm ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}
              </p>
            )}

            {status.error && (
              <p className={`text-red-400 text-sm ${isArabic ? "font-arabic" : ""}`}>
                {status.error}
              </p>
            )}
          </div>

          <p className={`text-sm text-gray-400 ${isArabic ? "text-right font-arabic" : ""}`}>
            {isArabic
              ? "هدفنا هو تعزيز التأثيرات الإيجابية الناتجة عن كيفية تعامل الشركات مع عملائها وفريقهم."
              : "Our goal is to translate the positive effects from revolutionizing company engagement."}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 my-8"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <p className={`${isArabic ? "font-arabic text-right" : ""}`}>
          {isArabic ? "جميع الحقوق محفوظة © 2025 الرفاع" : "Copyright © 2025 AL-Riffa"}
        </p>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaLinkedin size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaFacebook size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <SiX size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaInstagram size={24} />
          </a>
          <a className="text-white border border-gray-200 p-3 rounded-full transition-colors" href="#">
            <FaWhatsapp size={24} />
          </a>
        </div>

      </div>
    </footer>
  );
}
