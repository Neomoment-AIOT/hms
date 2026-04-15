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
  // TOKEN_IDENTIFIER = BUSINESS_ID.APP_NAME (Noon combines them as a single token)
  // If client provided it pre-combined, use it directly.
  // If not, we build it from BUSINESS_ID + APP_NAME.
  const tokenIdentifier = process.env.NOON_PAYMENT_TOKEN_IDENTIFIER
    || `${process.env.NOON_PAYMENT_BUSINESS_ID}.${process.env.NOON_PAYMENT_APP_NAME}`;

  const appKey   = process.env.NOON_PAYMENT_APP_KEY;
  const mode     = process.env.NOON_PAYMENT_MODE || "Test";          // "Test" | "Live"
  const category = process.env.NOON_PAYMENT_ORDER_CATEGORY || "pay";
  const channel  = (process.env.NOON_PAYMENT_CHANNEL || "web").charAt(0).toUpperCase()
                 + (process.env.NOON_PAYMENT_CHANNEL || "web").slice(1); // "web" → "Web"
  const returnUrl = process.env.NOON_PAYMENT_RETURN_URL || "http://localhost:3000/payment/callback";

  // Use the exact API endpoint the client configured (Saudi region: api-test.sa.noonpayments.com)
  const apiBase = (process.env.NOON_PAYMENT_API || "https://api-test.sa.noonpayments.com/payment/v1/")
    .replace(/\/$/, ""); // strip trailing slash for consistent URL building

  if (!tokenIdentifier || tokenIdentifier === "." || !appKey) {
    console.error("[payment/initiate] Missing Noon env vars — check NOON_PAYMENT_TOKEN_IDENTIFIER (or NOON_PAYMENT_BUSINESS_ID + NOON_PAYMENT_APP_NAME) and NOON_PAYMENT_APP_KEY");
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  // Auth header: Key_Test {tokenIdentifier}:{appKey}
  const authHeader = `Key_${mode} ${tokenIdentifier}:${appKey}`;

  // ── 3. Build Noon order payload ──────────────────────────────────
  const noonPayload = {
    apiOperation: "INITIATE",
    order: {
      reference:   orderRef,
      amount:      Number(amount.toFixed(2)),
      currency,
      name:        body.description || "Hotel Booking",
      description: body.description || "HMS Hotel Booking",
      category,                         // pre-configured in client's Noon account
    },
    configuration: {
      paymentAction: "SALE",            // capture immediately (not just auth)
      returnUrl,
      channel,                          // "Web" — pre-configured in client's account
    },
    // Optional: pre-fill customer details on Noon's checkout page
    ...(customer?.email && {
      billing: {
        firstName: customer.firstName || "",
        lastName:  customer.lastName  || "",
        email:     customer.email,
      },
    }),
  };

  // ── 4. Call Noon API ─────────────────────────────────────────────
  console.log("[payment/initiate] Calling Noon:", `${apiBase}/order`);
  console.log("[payment/initiate] Auth prefix:", `Key_${mode} ${tokenIdentifier.split(".")[0]}…`);

  let noonRes: Response;
  try {
    noonRes = await fetch(`${apiBase}/order`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  authHeader,
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

  // ── 6. Return checkout URL to the browser ────────────────────────
  return NextResponse.json({
    ok: true,
    checkoutWebUrl,
    noonOrderId: orderId,
  });
}
