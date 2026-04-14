"use client";

import { useContext, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";

const STATUS_MESSAGES: Record<string, { en: string; ar: string }> = {
  FAILED:    { en: "Your payment was declined.",       ar: "تم رفض عملية الدفع." },
  CANCELLED: { en: "You cancelled the payment.",       ar: "تم إلغاء عملية الدفع." },
  EXPIRED:   { en: "The payment session has expired.", ar: "انتهت صلاحية جلسة الدفع." },
  REVERSED:  { en: "The payment was reversed.",        ar: "تم عكس عملية الدفع." },
};

function FailedContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { lang }     = useContext(LangContext);
  const isArabic     = lang === "ar";

  const status  = searchParams.get("status") || "FAILED";
  const orderId = searchParams.get("orderId");
  const msg     = STATUS_MESSAGES[status] ?? STATUS_MESSAGES.FAILED;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">
        {isArabic ? "فشل الدفع" : "Payment Failed"}
      </h1>

      <p className="text-gray-500 text-center max-w-sm">
        {isArabic ? msg.ar : msg.en}
      </p>

      {orderId && (
        <p className="text-xs text-gray-400">
          {isArabic ? `رقم الطلب: ${orderId}` : `Order ID: ${orderId}`}
        </p>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          {isArabic ? "المحاولة مجدداً" : "Try Again"}
        </button>
        <button
          onClick={() => router.push("/hotel")}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
        </button>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <FailedContent />
    </Suspense>
  );
}
