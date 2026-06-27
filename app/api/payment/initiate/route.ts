import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/initiate
 *
 * Two-step MyFatoorah flow:
 *  Step A — InitiatePayment  → discovers which PaymentMethodIds are available
 *            for this token + amount + currency combination
 *  Step B — ExecutePayment   → creates the invoice using the discovered method ID
 *
 * Returns:
 *   { ok: true, checkoutWebUrl: string, invoiceId: number }
 */
export async function POST(request: NextRequest) {
  // ── 1. Read + validate body ──────────────────────────────────────
  let body: {
    amount: number;
    currency?: string;
    orderRef: string;
    description?: string;
    hotelId?: number;
    roomTypeId?: number;
    checkIn?: string;
    checkOut?: string;
    customer?: { firstName?: string; lastName?: string; email?: string };
    paymentMethodId?: number;   // if provided, skip InitiatePayment discovery step
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { amount, orderRef, customer } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { ok: false, error: "amount is required and must be > 0" },
      { status: 400 }
    );
  }
  if (!orderRef) {
    return NextResponse.json({ ok: false, error: "orderRef is required" }, { status: 400 });
  }

  // ── 2. Config ────────────────────────────────────────────────────
  const apiToken    = process.env.MYFATOORAH_API_TOKEN;
  const baseUrl     = (process.env.MYFATOORAH_BASE_URL || "https://apitest.myfatoorah.com").replace(/\/$/, "");
  const callBackUrl = process.env.MYFATOORAH_CALLBACK_URL || "http://localhost:3000/payment/callback";
  const errorUrl    = process.env.MYFATOORAH_ERROR_URL    || "http://localhost:3000/payment/failed";
  const webhookUrl  = process.env.MYFATOORAH_WEBHOOK_URL;

  if (!apiToken) {
    console.error("[payment/initiate] Missing MYFATOORAH_API_TOKEN env var");
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  const authHeader = { "Content-Type": "application/json", "Authorization": `Bearer ${apiToken}` };

  // ── STEP A: Resolve PaymentMethodId ─────────────────────────────
  // If the frontend already sent a methodId (user picked from our modal), use it directly.
  // Otherwise auto-discover via InitiatePayment (fallback, e.g. direct API calls).
  if (body.paymentMethodId) {
    console.log("[payment/initiate] Using caller-supplied PaymentMethodId:", body.paymentMethodId);
  }

  console.log("[payment/initiate] Step A — calling InitiatePayment to discover method IDs...");

  let methodId: number | null = body.paymentMethodId ?? null;

  if (!methodId) try {
    const initRes = await fetch(`${baseUrl}/v2/InitiatePayment`, {
      method:  "POST",
      headers: authHeader,
      body:    JSON.stringify({
        InvoiceAmount: Number(amount.toFixed(2)),
        CurrencyIso:   "SAR",
      }),
    });

    const initData = await initRes.json();
    console.log("[payment/initiate] InitiatePayment response:", JSON.stringify(initData, null, 2));

    if (initData.IsSuccess && Array.isArray(initData.Data?.PaymentMethods)) {
      const methods: Array<{ PaymentMethodId: number; PaymentMethodEn: string; IsDirectPayment: boolean }> =
        initData.Data.PaymentMethods;

      console.log(
        "[payment/initiate] Available payment methods:",
        methods.map((m) => `${m.PaymentMethodId} = ${m.PaymentMethodEn}`).join(", ")
      );

      // Prefer a non-direct (hosted page) method in this order:
      // Visa/Master → KNET → Mada → STC Pay → first available
      const preferred = ["VISA/MASTER", "VISA", "MASTER", "KNET", "MADA", "STC PAY"];
      let picked = methods.find(
        (m) => !m.IsDirectPayment && preferred.some((p) => m.PaymentMethodEn.toUpperCase().includes(p))
      );
      if (!picked) {
        // Fallback: just take the first non-direct method
        picked = methods.find((m) => !m.IsDirectPayment) ?? methods[0];
      }

      if (picked) {
        methodId = picked.PaymentMethodId;
        console.log(`[payment/initiate] Selected method: ${methodId} = ${picked.PaymentMethodEn}`);
      }
    }
  } catch (err) {
    console.warn("[payment/initiate] InitiatePayment failed — will try SAR currency fallback:", err);
  }

  // If SAR returned no methods (demo is KWD-based), retry with KWD
  if (methodId === null) {
    console.log("[payment/initiate] No SAR methods found — retrying InitiatePayment with KWD...");
    try {
      const initRes = await fetch(`${baseUrl}/v2/InitiatePayment`, {
        method:  "POST",
        headers: authHeader,
        body:    JSON.stringify({
          InvoiceAmount: Number(amount.toFixed(2)),
          CurrencyIso:   "KWD",
        }),
      });

      const initData = await initRes.json();
      console.log("[payment/initiate] InitiatePayment (KWD) response:", JSON.stringify(initData, null, 2));

      if (initData.IsSuccess && Array.isArray(initData.Data?.PaymentMethods)) {
        const methods: Array<{ PaymentMethodId: number; PaymentMethodEn: string; IsDirectPayment: boolean }> =
          initData.Data.PaymentMethods;

        console.log(
          "[payment/initiate] Available KWD payment methods:",
          methods.map((m) => `${m.PaymentMethodId} = ${m.PaymentMethodEn}`).join(", ")
        );

        const preferred = ["VISA/MASTER", "VISA", "MASTER", "KNET", "MADA", "STC PAY"];
        let picked = methods.find(
          (m) => !m.IsDirectPayment && preferred.some((p) => m.PaymentMethodEn.toUpperCase().includes(p))
        );
        if (!picked) {
          picked = methods.find((m) => !m.IsDirectPayment) ?? methods[0];
        }

        if (picked) {
          methodId = picked.PaymentMethodId;
          console.log(`[payment/initiate] Selected KWD method: ${methodId} = ${picked.PaymentMethodEn}`);
        }
      }
    } catch (err) {
      console.error("[payment/initiate] InitiatePayment KWD also failed:", err);
    }
  }

  if (methodId === null) {
    console.error("[payment/initiate] Could not discover any valid PaymentMethodId from InitiatePayment");
    return NextResponse.json(
      { ok: false, error: "No payment methods available from gateway" },
      { status: 502 }
    );
  }

  // ── STEP B: ExecutePayment — create the invoice ──────────────────
  const customerName = [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") || "Guest";

  const mfPayload: Record<string, unknown> = {
    PaymentMethodId:    methodId,
    InvoiceValue:       Number(amount.toFixed(2)),
    CallBackUrl:        callBackUrl,
    ErrorUrl:           errorUrl,
    Language:           "EN",
    CustomerName:       customerName,
    CustomerReference:  orderRef,
    DisplayCurrencyIso: "SAR",
    InvoiceItems: [
      {
        ItemName:  body.description || "Hotel Booking",
        Quantity:  1,
        UnitPrice: Number(amount.toFixed(2)),
      },
    ],
  };

  if (customer?.email) mfPayload.CustomerEmail = customer.email;
  if (webhookUrl)       mfPayload.WebhookUrl   = webhookUrl;

  console.log("[payment/initiate] Step B — ExecutePayment payload:", JSON.stringify(mfPayload, null, 2));

  let mfRes: Response;
  try {
    mfRes = await fetch(`${baseUrl}/v2/ExecutePayment`, {
      method:  "POST",
      headers: authHeader,
      body:    JSON.stringify(mfPayload),
    });
  } catch (err) {
    console.error("[payment/initiate] Network error calling ExecutePayment:", err);
    return NextResponse.json({ ok: false, error: "Payment gateway unreachable" }, { status: 502 });
  }

  const mfData = await mfRes.json();
  console.log("[payment/initiate] ExecutePayment response:", JSON.stringify(mfData, null, 2));

  if (!mfRes.ok || !mfData.IsSuccess) {
    console.error("[payment/initiate] ExecutePayment error:", JSON.stringify(mfData));
    return NextResponse.json(
      {
        ok:    false,
        error: mfData?.ValidationErrors?.[0]?.Error || mfData?.Message || "Payment initiation failed",
      },
      { status: 502 }
    );
  }

  const paymentUrl = mfData.Data?.PaymentURL;
  const invoiceId  = mfData.Data?.InvoiceId;

  if (!paymentUrl) {
    console.error("[payment/initiate] Missing PaymentURL in ExecutePayment response");
    return NextResponse.json({ ok: false, error: "No checkout URL returned" }, { status: 502 });
  }

  return NextResponse.json({
    ok:             true,
    checkoutWebUrl: paymentUrl,
    invoiceId,
  });
}
