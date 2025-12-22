"use client";

import React, { useEffect, useContext, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineCalendarToday, MdOutlineMailOutline } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { LangContext } from "@/app/lang-provider";
import MyBookingsPage from "@/app/my-bookings/page";

type User = {
  name: string;
  email: string;
};

type RetrieveBookingProps = {
  isOpen: boolean;
  onClose: () => void;
  openSignIn: () => void;
  user: User | null;
};

export default function RetrieveBooking({
  isOpen,
  onClose,
  openSignIn,
  user,
}: RetrieveBookingProps) {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";
  const router = useRouter();

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (user) {
      onClose();
      router.push("/my-bookings");
    }
  }, [user]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-xl w-full max-w-md p-8 relative ${
          isArabic ? "font-arabic" : ""
        }`}
        onClick={handleModalClick}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} text-gray-500`}
        >
          ✕
        </button>

        {/* Header */}
        <div className={`flex items-center gap-3 mb-4 ${isArabic ? "font-arabic" : ""}`}>
          <MdOutlineCalendarToday className="text-3xl text-slate-600" />
          <h1 className="text-2xl font-bold text-[#333C4E]">
            {isArabic ? "استرداد الحجز الخاص بي" : "Retrieve my booking"}
          </h1>
        </div>

        {/* Promo Section */}
        <div className={`flex items-center gap-4 mb-6 ${isArabic ? "font-arabic" : ""}`}>
          <div className="w-16 h-16 rounded-full border flex items-center justify-center">
            <HiOutlineMail className="text-3xl text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              {isArabic
                ? "سجّل الدخول لمزيد من الخيارات!"
                : "Sign in for more options!"}
            </h2>
            <div className="bg-[#D1FAE5] text-[#065F46] px-3 py-1 rounded-md text-sm font-semibold w-fit">
              {isArabic
                ? "إدارة الحجز بسهولة."
                : "Manage your booking with ease."}
            </div>
          </div>
        </div>

        {!user ? (
          <>
            {/* Email Input */}
            <div className={`mb-4 ${isArabic ? "font-arabic" : ""}`}>
              <label className="block mb-1 font-semibold">
                {isArabic ? "البريد الإلكتروني" : "Your Email"}
              </label>
              <div className="relative">
                <MdOutlineMailOutline
                  className={`absolute ${
                    isArabic ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-2xl text-slate-400`}
                />
                <input
                  type="email"
                  placeholder={isArabic ? "البريد الإلكتروني" : "Your email"}
                  className={`w-full bg-[#F3F4F6] rounded-2xl py-5 px-4 ${
                    isArabic ? "pr-14 text-right" : "pl-14 text-left"
                  }`}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isArabic
                  ? "عنوان البريد الإلكتروني المستخدم أثناء الحجز."
                  : "The email address used during booking."}
              </p>
            </div>

            {/* Buttons */}
            <button className={`w-full py-4 bg-linear-to-r from-[#248B96] to-[#0D4047] text-white font-bold rounded-2xl mb-3 ${isArabic ? "font-arabic" : ""}`}>
              {isArabic ? "استرداد الحجز" : "Retrieve my booking"}
            </button>

            <button
              onClick={() => {
                onClose();
                openSignIn();
              }}
              className={`w-full py-4 border rounded-2xl font-bold ${isArabic ? "font-arabic" : ""}`}
            >
              {isArabic ? "تسجيل الدخول" : "Login"}
            </button>
          </>
        ) : (
          <MyBookingsPage />
        )}
      </div>
    </div>
  );
}
