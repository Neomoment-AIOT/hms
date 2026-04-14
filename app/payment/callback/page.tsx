"use client";

/**
 * /payment/callback
 *
 * Noon redirects the user here after they complete (or cancel) payment.
 * URL params from Noon:
 *   orderId     – Noon's internal order ID
 *   resultCode  – 0 = success, non-zero = failure/cancel
 *
 * This page:
 *  1. Shows a "Verifying payment…" spinner
 *  2. Calls our BFF /api/payment/verify (server-side Noon lookup)
 *  3. If CAPTURED  → merges stored bookingData, saves to sessionStorage, redirects to /PayementSuccess
 *  4. Otherwise    → redirects to /payment/failed
 */

import { useEffect, useState, useContext, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { lang }     = useContext(LangContext);
  const isArabic     = lang === "ar";

  const [statusText, setStatusText] = useState(
    isArabic ? "جاري التحقق من الدفع…" : "Verifying payment…"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const noonOrderId = searchParams.get("orderId");
    const resultCode  = searchParams.get("resultCode");

    // Noon sends resultCode "0" for success path; others are failure
    // But we ALWAYS verify server-side regardless of this param
    if (!noonOrderId) {
      setError(isArabic ? "معرّف الطلب مفقود" : "Missing order ID from payment gateway");
      return;
    }

    async function verify() {
      try {
        const res  = await fetch("/api/payment/verify", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ noonOrderId }),
        });
        const json = await res.json();

        if (json.ok && json.isPaid) {
          // Merge noonOrderId into any stored bookingData
          const stored = sessionStorage.getItem("bookingData");
          if (stored) {
            try {
              const bd = JSON.parse(stored);
              bd.noonOrderId   = noonOrderId;
              bd.paymentStatus = "CAPTURED";
              sessionStorage.setItem("bookingData", JSON.stringify(bd));
            } catch { /* ignore parse errors */ }
          }
          router.replace(`/PayementSuccess?noonOrderId=${noonOrderId}`);
        } else {
          // Payment not captured — send to failed page with status
          const status = json.status || "FAILED";
          router.replace(`/payment/failed?status=${status}&orderId=${noonOrderId}`);
        }
      } catch {
        setError(
          isArabic
            ? "تعذّر التحقق من حالة الدفع. يرجى التواصل مع الدعم."
            : "Could not verify payment status. Please contact support."
        );
      }
    }

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {error ? (
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => router.push("/hotel")}
            className="px-6 py-2 bg-teal-700 text-white rounded-lg"
          >
            {isArabic ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>
      ) : (
        <>
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-lg">{statusText}</p>
        </>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
