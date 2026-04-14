import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/initiate
 *
 * Creates a Noon payment order and returns the hosted checkout URL.
 * All Noon credentials stay server-side — never sent to the browser.
 *
 * Body:
 *   amount        number   – total to charge (SAR)
 *   currency      string   – "SAR" (default)
 *   orderRef      string   – your internal booking reference
 *   description   string   – shown on Noon checkout page
 *   hotelId       number
 *   roomTypeId    number
 *   checkIn       string   – "YYYY-MM-DD"
 *   checkOut      string   – "YYYY-MM-DD"
 *   customer      { firstName, lastName, email }
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
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { amount, orderRef, customer } = body;
  const currency = body.currency || "SAR";

  if (!amount || amount <= 0) {
    return NextResponse.json({ ok: false, error: "amount is required and must be > 0" }, { status: 400 });
  }
  if (!orderRef) {
    return NextResponse.json({ ok: false, error: "orderRef is required" }, { status: 400 });
  }

  // ── 2. Noon config — read from env, never from client ────────────
  const businessId = process.env.NOON_BUSINESS_IDENTIFIER;
  const appId      = process.env.NOON_APP_IDENTIFIER;
  const appKey     = process.env.NOON_APP_KEY;
  const noonEnv    = process.env.NOON_ENV || "test";           // "test" | "live"
  const returnUrl  = process.env.NOON_RETURN_URL;

  if (!businessId || !appId || !appKey) {
    console.error("[payment/initiate] Missing Noon env vars");
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  const isLive    = noonEnv === "live";
  const apiBase   = isLive
    ? "https://api.noonpayments.com/payment/v1"
    : "https://api-test.noonpayments.com/payment/v1";
  const keyPrefix = isLive ? "Key_Live" : "Key_Test";
  const authHeader = `${keyPrefix} ${businessId}.${appId}:${appKey}`;

  // ── 3. Build Noon order payload ──────────────────────────────────
  const noonPayload = {
    apiOperation: "INITIATE",
    order: {
      reference:   orderRef,
      amount:      Number(amount.toFixed(2)),
      currency,
      name:        body.description || "Hotel Booking",
      description: body.description || "HMS Hotel Booking",
      channel:     "Web",
    },
    configuration: {
      paymentAction: "SALE",           // charge immediately (not just auth)
      returnUrl:     returnUrl || "http://localhost:3000/payment/callback",
    },
    // Optional: pre-fill customer name on Noon's checkout page
    ...(customer?.email && {
      billing: {
        firstName: customer.firstName || "",
        lastName:  customer.lastName  || "",
        email:     customer.email,
      },
    }),
  };

  // ── 4. Call Noon API ─────────────────────────────────────────────
  let noonRes: Response;
  try {
    noonRes = await fetch(`${apiBase}/order`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(noonPayload),
    });
  } catch (err) {
    console.error("[payment/initiate] Network error calling Noon:", err);
    return NextResponse.json({ ok: false, error: "Payment gateway unreachable" }, { status: 502 });
  }

  const noonData = await noonRes.json();

  // ── 5. Check Noon response ───────────────────────────────────────
  if (!noonRes.ok || noonData?.result?.code !== 0) {
    console.error("[payment/initiate] Noon error:", JSON.stringify(noonData));
    return NextResponse.json(
      { ok: false, error: noonData?.result?.message || "Payment initiation failed" },
      { status: 502 }
    );
  }

  const { orderId, checkoutWebUrl } = noonData.resultData;

  if (!checkoutWebUrl) {
    return NextResponse.json({ ok: false, error: "No checkout URL returned from Noon" }, { status: 502 });
  }

  // ── 6. Return checkout URL to the browser ───────────────────────
  // orderId is your reference to verify the payment after redirect
  return NextResponse.json({
    ok: true,
    checkoutWebUrl,
    noonOrderId: orderId,
  });
}
