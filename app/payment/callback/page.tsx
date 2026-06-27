"use client";

/**
 * /payment/callback
 *
 * MyFatoorah redirects the user here after successful payment.
 * MyFatoorah also redirects to ErrorUrl (/payment/failed) on failure,
 * but we still verify on both to be safe.
 *
 * URL param from MyFatoorah:
 *   paymentId  – transaction-level ID used for GetPaymentStatus lookup
 *
 * This page:
 *  1. Shows a "Verifying payment…" spinner
 *  2. Calls our BFF /api/payment/verify (server-side MyFatoorah lookup)
 *  3. If Paid     → merges stored bookingData, saves to sessionStorage, redirects to /PayementSuccess
 *  4. Otherwise   → redirects to /payment/failed
 */

import { useEffect, useState, useContext, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LangContext } from "@/app/lang-provider";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { lang }     = useContext(LangContext);
  const isArabic     = lang === "ar";

  const [statusText] = useState(
    isArabic ? "جاري التحقق من الدفع…" : "Verifying payment…"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // MyFatoorah appends ?paymentId=xxx to both CallBackUrl and ErrorUrl
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      setError(isArabic ? "معرّف الدفع مفقود" : "Missing payment ID from gateway");
      return;
    }

    async function verify() {
      try {
        const res  = await fetch("/api/payment/verify", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ paymentId }),
        });
        const json = await res.json();

        if (json.ok && json.isPaid) {
          // Merge invoiceId into any stored bookingData
          const stored = sessionStorage.getItem("bookingData");
          if (stored) {
            try {
              const bd = JSON.parse(stored);
              bd.invoiceId     = json.invoiceId;
              bd.paymentId     = paymentId;
              bd.paymentStatus = "Paid";
              sessionStorage.setItem("bookingData", JSON.stringify(bd));
            } catch { /* ignore parse errors */ }
          }
          // json.reference = CustomerReference = HMS-17-xxx = our orderRef
          const orderRef = json.reference || "";
          router.replace(
            `/PayementSuccess?invoiceId=${json.invoiceId}&paymentId=${paymentId}&orderRef=${encodeURIComponent(orderRef)}`
          );
        } else {
          // Payment not confirmed — send to failed page
          const status = json.status || "Canceled";
          router.replace(`/payment/failed?status=${status}&invoiceId=${json.invoiceId || ""}`);
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
