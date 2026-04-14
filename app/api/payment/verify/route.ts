import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/verify
 *
 * Re-fetches the Noon order from Noon's servers and confirms the payment
 * status. NEVER trust the status from the browser redirect — always verify
 * server-side before marking a booking as paid.
 *
 * Body:
 *   noonOrderId   number | string   – the orderId Noon gave us at initiate
 */

type NoonOrderStatus =
  | "INITIATED"
  | "AUTHORIZED"
  | "CAPTURED"    // ← money collected — booking is paid
  | "REVERSED"
  | "REFUNDED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export async function POST(request: NextRequest) {
  // ── 1. Read body ─────────────────────────────────────────────────
  let body: { noonOrderId?: string | number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { noonOrderId } = body;
  if (!noonOrderId) {
    return NextResponse.json({ ok: false, error: "noonOrderId is required" }, { status: 400 });
  }

  // ── 2. Noon config ───────────────────────────────────────────────
  const businessId = process.env.NOON_BUSINESS_IDENTIFIER;
  const appId      = process.env.NOON_APP_IDENTIFIER;
  const appKey     = process.env.NOON_APP_KEY;
  const noonEnv    = process.env.NOON_ENV || "test";

  if (!businessId || !appId || !appKey) {
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  const isLive    = noonEnv === "live";
  const apiBase   = isLive
    ? "https://api.noonpayments.com/payment/v1"
    : "https://api-test.noonpayments.com/payment/v1";
  const keyPrefix = isLive ? "Key_Live" : "Key_Test";
  const authHeader = `${keyPrefix} ${businessId}.${appId}:${appKey}`;

  // ── 3. Fetch order from Noon ─────────────────────────────────────
  let noonRes: Response;
  try {
    noonRes = await fetch(`${apiBase}/order/${noonOrderId}`, {
      method:  "GET",
      headers: { Authorization: authHeader },
    });
  } catch (err) {
    console.error("[payment/verify] Network error calling Noon:", err);
    return NextResponse.json({ ok: false, error: "Payment gateway unreachable" }, { status: 502 });
  }

  const noonData = await noonRes.json();

  if (!noonRes.ok || noonData?.result?.code !== 0) {
    console.error("[payment/verify] Noon error:", JSON.stringify(noonData));
    return NextResponse.json(
      { ok: false, error: noonData?.result?.message || "Could not retrieve order from Noon" },
      { status: 502 }
    );
  }

  // ── 4. Inspect order status ──────────────────────────────────────
  const order = noonData.resultData?.order;
  const status: NoonOrderStatus = order?.status;
  const isPaid = status === "CAPTURED";

  // Amount Noon captured (for your records)
  const capturedAmount: number = order?.amount ?? 0;
  const currency: string       = order?.currency ?? "SAR";
  const reference: string      = order?.reference ?? "";   // your orderRef

  return NextResponse.json({
    ok:      true,
    isPaid,
    status,
    noonOrderId,
    capturedAmount,
    currency,
    reference,
  });
}
