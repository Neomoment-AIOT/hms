"use client";

import { useState, MouseEvent, useContext } from "react";
import { LangContext } from "@/app/lang-provider";

interface ForgotPasswordProps {
    onClose: () => void;
    openSignIn: () => void;
}

export default function ForgotPassword({ onClose, openSignIn }: ForgotPasswordProps) {
    const { lang } = useContext(LangContext);
    const isArabic = lang === "ar";

    const [email, setEmail] = useState("");

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative ${isArabic ? "font-arabic" : ""}`}
                onClick={handleModalClick}
                dir={isArabic ? "rtl" : "ltr"}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} text-gray-500`}
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {isArabic ? "نسيت كلمة المرور" : "Forgot Password"}
                </h2>

                <div className="flex flex-col space-y-4">
                    <label>{isArabic ? "البريد الإلكتروني" : "Email"}</label>
                    <input
                        type="email"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button className="bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded-lg">
                        {isArabic ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
                    </button>

                    <p className="text-center text-gray-600 mt-2 cursor-pointer hover:underline" onClick={openSignIn}>
                        {isArabic ? "رجوع إلى تسجيل الدخول" : "Back to Sign In"}
                    </p>
                </div>
            </div>
        </div>
    );
}
