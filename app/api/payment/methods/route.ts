import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/methods
 *
 * Calls MyFatoorah InitiatePayment and returns the list of available
 * payment methods for the given amount so the frontend can show a
 * method-selection UI.
 *
 * Body:  { amount: number }
 *
 * Returns:
 *   { ok: true, methods: PaymentMethod[] }
 */

export type PaymentMethod = {
  id:            number;
  nameEn:        string;
  nameAr:        string;
  code:          string;
  imageUrl:      string;
  totalAmount:   number;   // already includes service charge — what user actually pays
  currencyIso:   string;   // display currency (SAR)
  serviceCharge: number;
};

export async function POST(request: NextRequest) {
  let body: { amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { amount } = body;
  if (!amount || amount <= 0) {
    return NextResponse.json({ ok: false, error: "amount is required" }, { status: 400 });
  }

  const apiToken = process.env.MYFATOORAH_API_TOKEN;
  const baseUrl  = (process.env.MYFATOORAH_BASE_URL || "https://apitest.myfatoorah.com").replace(/\/$/, "");

  if (!apiToken) {
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  const headers = {
    "Content-Type":  "application/json",
    "Authorization": `Bearer ${apiToken}`,
  };

  // Try SAR first (live SA account), fall back to KWD (demo token is KWT-based)
  for (const currency of ["SAR", "KWD"]) {
    try {
      const res = await fetch(`${baseUrl}/v2/InitiatePayment`, {
        method:  "POST",
        headers,
        body:    JSON.stringify({ InvoiceAmount: Number(amount.toFixed(2)), CurrencyIso: currency }),
      });

      const data = await res.json();

      if (data.IsSuccess && Array.isArray(data.Data?.PaymentMethods) && data.Data.PaymentMethods.length > 0) {
        // Filter out direct-payment methods (those require card data on our server — PCI risk)
        const methods: PaymentMethod[] = data.Data.PaymentMethods
          .filter((m: { IsDirectPayment: boolean }) => !m.IsDirectPayment)
          .map((m: {
            PaymentMethodId: number;
            PaymentMethodEn: string;
            PaymentMethodAr: string;
            PaymentMethodCode: string;
            ImageUrl: string;
            TotalAmount: number;
            CurrencyIso: string;
            ServiceCharge: number;
          }) => ({
            id:            m.PaymentMethodId,
            nameEn:        m.PaymentMethodEn,
            nameAr:        m.PaymentMethodAr,
            code:          m.PaymentMethodCode,
            imageUrl:      m.ImageUrl,
            totalAmount:   m.TotalAmount,
            currencyIso:   m.CurrencyIso,
            serviceCharge: m.ServiceCharge,
          }));

        return NextResponse.json({ ok: true, methods });
      }
    } catch (err) {
      console.error(`[payment/methods] InitiatePayment (${currency}) failed:`, err);
    }
  }

  return NextResponse.json({ ok: false, error: "No payment methods available" }, { status: 502 });
}
