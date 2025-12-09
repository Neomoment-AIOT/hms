"use client";
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { LangContext } from "@/app/lang-provider";

interface ContactFormState {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string;
}

interface StatusState {
  loading: boolean;
  success: boolean;
  error: string;
}

export default function ContactUs() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";

  const [form, setForm] = useState<ContactFormState>({
    prefix: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [status, setStatus] = useState<StatusState>({
    loading: false,
    success: false,
    error: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setStatus({ loading: false, success: true, error: "" });

      setForm({
        prefix: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        message: "",
      });

      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setStatus({ loading: false, success: false, error: errorMessage });
    }
  };

  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-8" dir={ar ? "rtl" : "ltr"}>

        {/* TOP DESCRIPTION */}
        <p
          className={`text-center text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4 ${ar ? "font-arabic text-right" : ""
            }`}
        >
          {ar
            ? "تواصل مع فريق الخبراء لدينا للحصول على أفضل عروض الفنادق في مكة والمدينة."
            : "Contact Our Expert Team for the best hotel deals in Makkah and Madinah."}
        </p>

        <p
          className={`text-center text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12 ${ar ? "font-arabic text-right" : ""
            }`}
        >
          {ar
            ? "احصل على مساعدة مخصصة وضمان أفضل الأسعار."
            : "Get Personalized Assistance and Guaranteed best Rates."}
        </p>

        {/* INFO BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">

          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className={`${ar ? "font-arabic" : ""} text-xl font-semibold`}>
              {ar ? "البريد الإلكتروني" : "Email"}
            </h3>
            <p className={`${ar ? "font-arabic" : ""} text-gray-700 font-medium text-lg`}>
              marketing@alrefaa.co
            </p>
            <p className={`${ar ? "font-arabic" : ""} text-gray-500 text-base`}>
              {ar ? "الرد خلال ساعتين" : "Response within 2 hours"}
            </p>
          </div>

          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className={`text-xl font-semibold ${ar ? "font-arabic" : ""}`}>
              {ar ? "الهاتف" : "Phone"}
            </h3>
            <p className={`text-gray-700 font-medium text-lg ${ar ? "font-arabic" : ""}`}>
              {ar
                ? <span dir="ltr">+966 9200 10417</span>
                : "+966 9200 10417"}
            </p>
            <p className={`text-gray-500 text-base ${ar ? "font-arabic" : ""}`}>
              {ar ? "دعم على مدار الساعة" : "24/7 Customer Support"}
            </p>
          </div>


          <div className="border border-teal-900 rounded-xl p-6 text-center">
            <h3 className={`${ar ? "font-arabic" : ""} text-xl font-semibold`}>
              {ar ? "موقع المكتب" : "Office Location"}
            </h3>
            <p className={`${ar ? "font-arabic" : ""} text-gray-700 font-medium text-lg`}>
              {ar
                ? "العزيزية، مكة المكرمة، السعودية"
                : "Al Azzizyah, Makkah, Saudi Arabia"}
            </p>
            <p className={`${ar ? "font-arabic" : ""} text-gray-500 text-base`}>
              {ar ? "قم بزيارة مكتبنا" : "Visit our local office"}
            </p>
          </div>

        </div>

        {/* FORM TITLE */}
        <div className="mt-16">
          <h2
            className={`text-3xl font-semibold text-gray-900 mb-6 ${ar ? "font-arabic text-right" : ""
              }`}
          >
            {ar ? "تواصل معنا!" : "Get in Touch with Us!"}
          </h2>

          {/* CONTACT FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* FIRST ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="relative">
                <select
                  name="prefix"
                  value={form.prefix}
                  onChange={handleChange}
                  required
                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none bg-white ${ar ? "font-arabic pr-10 text-right" : ""
                    }`}
                >
                  <option value="">{ar ? "اللقب" : "Prefix"}</option>
                  <option value="Mr">{ar ? "السيد" : "Mr"}</option>
                  <option value="Mrs">{ar ? "السيدة" : "Mrs"}</option>
                  <option value="Ms">{ar ? "آنسة" : "Ms"}</option>
                  <option value="Miss">{ar ? "آنسة" : "Miss"}</option>
                </select>

                {/* ARROW — ONLY FLIPS IN ARABIC */}
                <span
                  className={`pointer-events-none absolute inset-y-0 flex items-center text-gray-500 ${ar ? "left-3" : "right-3"
                    }`}
                >
                  ▼
                </span>
              </div>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder={ar ? "أدخل الاسم الأول" : "Enter your first name"}
                className={`border border-gray-300 rounded-lg px-4 py-3 outline-teal-700 ${ar ? "font-arabic text-right" : ""
                  }`}
              />

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder={ar ? "أدخل اسم العائلة" : "Enter your last name"}
                className={`border border-gray-300 rounded-lg px-4 py-3 outline-teal-700 ${ar ? "font-arabic text-right" : ""
                  }`}
              />

            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={ar ? "أدخل بريدك الإلكتروني" : "Enter your Email"}
                className={`border border-gray-300 rounded-lg px-4 py-3 outline-teal-700 ${ar ? "font-arabic text-right" : ""
                  }`}
              />

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                placeholder={ar ? "أدخل رقم هاتفك" : "Enter your Phone Number"}
                className={`border border-gray-300 rounded-lg px-4 py-3 outline-teal-700 ${ar ? "font-arabic text-right" : ""
                  }`}
              />

            </div>

            {/* MESSAGE */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder={ar ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
              className={`border border-gray-300 rounded-lg px-4 py-3 w-full outline-teal-700 ${ar ? "font-arabic text-right" : ""
                }`}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className={`bg-linear-to-r from-[#1F8593] to-[#052E39] 
                text-white px-8 py-4 rounded-lg text-lg w-full md:w-56 
                disabled:opacity-70 hover:opacity-90 transition-opacity
                ${ar ? "font-arabic" : ""}`}
              disabled={status.loading}
            >
              {ar
                ? status.loading
                  ? "جاري الإرسال..."
                  : "إرسال الرسالة"
                : status.loading
                  ? "Sending..."
                  : "Send Message"}
            </button>

            {/* STATUS MESSAGES */}
            {status.success && (
              <div
                className={`p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg ${ar ? "font-arabic text-right" : ""
                  }`}
              >
                {ar
                  ? "شكراً لك! تم إرسال رسالتك بنجاح."
                  : "Thank you! Your message has been sent successfully."}
              </div>
            )}

            {status.error && !status.loading && (
              <div
                className={`p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg ${ar ? "font-arabic text-right" : ""
                  }`}
              >
                {status.error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}