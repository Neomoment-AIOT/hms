"use client";

import { useState, MouseEvent, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";

interface SignUpProps {
    onClose: () => void;
    openSignIn: () => void; // To switch back to sign in
}

export default function SignUp({ onClose, openSignIn }: SignUpProps) {
    const { lang } = useContext(LangContext);
    const isArabic = lang === "ar";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError(isArabic ? "جميع الحقول مطلوبة" : "All fields are required");
            setSuccess("");
            return;
        }

        setError("");
        setSuccess(isArabic ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!");
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative ${
                    isArabic ? "font-arabic" : ""
                }`}
                onClick={handleModalClick}
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-3 ${
                        isArabic ? "left-3" : "right-3"
                    } cursor-pointer text-gray-500 hover:text-gray-700`}
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {isArabic ? "إنشاء حساب" : "Sign Up"}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">
                            {isArabic ? "الاسم" : "Name"}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder={isArabic ? "أدخل اسمك" : "Enter your name"}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">
                            {isArabic ? "البريد الإلكتروني" : "Email"}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col relative">
                        <label className="mb-1 font-medium">
                            {isArabic ? "كلمة المرور" : "Password"}
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={isArabic ? "أدخل كلمة المرور" : "Enter your password"}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${
                                isArabic ? "left-3" : "right-3"
                            } top-[38px] text-gray-500 hover:text-gray-700`}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Error message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Success message */}
                    {success && <p className="text-green-600 text-sm">{success}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-[#1F8593] to-[#052E39] text-white cursor-pointer py-2 rounded-lg transition"
                    >
                        {isArabic ? "إنشاء حساب" : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    {isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}
                </p>

                <button
                    onClick={openSignIn}
                    className="w-full mt-2 rounded-lg font-medium text-black bg-white border-2 border-black py-2"
                >
                    {isArabic ? "تسجيل الدخول" : "Sign In"}
                </button>
            </div>
        </div>
    );
}