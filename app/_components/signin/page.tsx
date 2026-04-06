"use client";

import { useState, MouseEvent, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LangContext } from "@/app/lang-provider";

interface SignInProps {
  onClose: () => void;
  openSignUp: () => void;
  openForgot: () => void;
  onSuccess?: (user: { name: string; email: string }) => void; // ✅ updated
}

export default function SignIn({
  onClose,
  openSignUp,
  openForgot,
  onSuccess,
}: SignInProps) {
  const { lang } = useContext(LangContext);
  const isArabic = lang === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 FAKE AUTH
    if (email !== "admin@gmail.com" || password !== "admin") {
      setError(
        isArabic
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "Incorrect email or password"
      );
      return;
    }

    // ✅ SUCCESS - add default name
    onSuccess?.({ name: "Admin", email }); 
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white text-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8 relative ${
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

        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isArabic ? "تسجيل الدخول" : "Sign In"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label className="block mb-1">{isArabic ? "البريد الإلكتروني" : "Email"}</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="block mb-1">{isArabic ? "كلمة المرور" : "Password"}</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              value={password}
              placeholder={isArabic ? "أدخل كلمة المرور" : "Enter your password"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${isArabic ? "left-3" : "right-3"} top-9`}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <p
              onClick={openForgot}
              className={`text-sm mt-2 cursor-pointer hover:underline ${
                isArabic ? "text-left" : "text-right"
              }`}
            >
              {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-linear-to-r from-[#1F8593] to-[#052E39] text-white py-2 rounded-lg">
            {isArabic ? "تسجيل الدخول" : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4">{isArabic ? "ليس لديك حساب؟" : "Don't have an account?"}</p>

        <button
          onClick={openSignUp}
          className="w-full mt-2 border-2 border-black rounded-lg py-2"
        >
          {isArabic ? "إنشاء حساب" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
