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
  const mode = process.env.NOON_PAYMENT_MODE || "Test";   // "Test" | "Live"
  const category = process.env.NOON_PAYMENT_ORDER_CATEGORY || "pay";
  const channel = (process.env.NOON_PAYMENT_CHANNEL || "web").charAt(0).toUpperCase()
    + (process.env.NOON_PAYMENT_CHANNEL || "web").slice(1); // "web" → "Web"
  const returnUrl = process.env.NOON_PAYMENT_RETURN_URL || "http://localhost:3000/payment/callback";
  const apiBase = (process.env.NOON_PAYMENT_API || "https://api-test.sa.noonpayments.com/payment/v1/")
    .replace(/\/$/, "");

  // ── Auth header construction ─────────────────────────────────────
  // Noon supports two formats depending on what the client provides:
  //
  // Format A — TOKEN_IDENTIFIER is a pre-encoded Base64 credential
  //   (Noon encodes businessId.appName:appKey into one Base64 string)
  //   Header: Key_Test {TOKEN_IDENTIFIER}        ← no extra appKey appended
  //
  // Format B — raw parts provided separately
  //   Header: Key_Test {BUSINESS_ID}.{APP_NAME}:{APP_KEY}
  //
  // The client's TOKEN_IDENTIFIER is Base64 → use Format A.
  const tokenIdentifier = process.env.NOON_PAYMENT_TOKEN_IDENTIFIER;
  const appKey = process.env.NOON_PAYMENT_APP_KEY;

  let authHeader: string;

  if (tokenIdentifier) {
    // Format A: TOKEN_IDENTIFIER already encodes everything — use as-is
    authHeader = `Key_${mode} ${tokenIdentifier}`;
  } else {
    // Format B: build from separate parts
    const businessId = process.env.NOON_PAYMENT_BUSINESS_ID;
    const appName = process.env.NOON_PAYMENT_APP_NAME;
    if (!businessId || !appName || !appKey) {
      console.error("[payment/initiate] Missing Noon env vars — set NOON_PAYMENT_TOKEN_IDENTIFIER or NOON_PAYMENT_BUSINESS_ID + NOON_PAYMENT_APP_NAME + NOON_PAYMENT_APP_KEY");
      return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
    }
    authHeader = `Key_${mode} ${businessId}.${appName}:${appKey}`;
  }

  // ── 3. Build Noon order payload ──────────────────────────────────
  // channel and category both belong inside the `order` object per Noon's API spec
  const noonPayload = {
    apiOperation: "INITIATE",
    order: {
      reference: orderRef,
      amount: Number(amount.toFixed(2)),
      currency,
      // name:      (body.description || "Hotel Booking").slice(0, 50), // Noon caps name at 50 chars
      name: "Hotel Booking",
      channel,     // ← must be in order, NOT configuration
      category,    // ← must be in order, NOT configuration
    },
    configuration: {
      paymentAction: "SALE",   // charge immediately (not just auth)
      returnUrl,
    },
    // Optional: pre-fill customer details on Noon's checkout page
    ...(customer?.email && {
      billing: {
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email,
      },
    }),
  };

  // Log the full payload so you can inspect it during testing
  console.log("[payment/initiate] Payload to Noon:", JSON.stringify(noonPayload, null, 2));

  // ── 4. Call Noon API ─────────────────────────────────────────────
  console.log("[payment/initiate] Calling Noon:", `${apiBase}/order`);
  console.log("[payment/initiate] Auth mode:", `Key_${mode}`, "| token set:", !!tokenIdentifier);

  let noonRes: Response;
  try {
    noonRes = await fetch(`${apiBase}/order`, {
      method: "POST",
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
  // Noon response check logic update:
  if (!noonRes.ok || noonData.resultCode !== 0) {
    console.error("[payment/initiate] Noon error response:", JSON.stringify(noonData));
    return NextResponse.json(
      { ok: false, error: noonData?.message || "Payment initiation failed" },
      { status: 502 }
    );
  }

  // Noon ke naye data structure se checkout URL nikalna:
  const checkoutWebUrl = noonData.result?.checkoutData?.postUrl;
  const orderId = noonData.result?.order?.id;

  if (!checkoutWebUrl) {
    console.error("[payment/initiate] Missing postUrl in Noon response");
    return NextResponse.json({ ok: false, error: "No checkout URL returned" }, { status: 502 });
  }

  // ── 6. Return success to frontend ────────────────────────
  return NextResponse.json({
    ok: true,
    checkoutWebUrl: checkoutWebUrl,
    noonOrderId: orderId,
  });
}
