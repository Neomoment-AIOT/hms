import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/verify
 *
 * Re-fetches the Noon order from Noon's servers and confirms payment status.
 * NEVER trust the status from the browser redirect — always verify server-side.
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
  const tokenIdentifier = process.env.NOON_PAYMENT_TOKEN_IDENTIFIER
    || `${process.env.NOON_PAYMENT_BUSINESS_ID}.${process.env.NOON_PAYMENT_APP_NAME}`;

  const appKey = process.env.NOON_PAYMENT_APP_KEY;
  const mode   = process.env.NOON_PAYMENT_MODE || "Test";

  const apiBase = (process.env.NOON_PAYMENT_API || "https://api-test.sa.noonpayments.com/payment/v1/")
    .replace(/\/$/, "");

  if (!tokenIdentifier || tokenIdentifier === "." || !appKey) {
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  const authHeader = `Key_${mode} ${tokenIdentifier}:${appKey}`;

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

  const capturedAmount: number = order?.amount   ?? 0;
  const currency: string       = order?.currency ?? "SAR";
  const reference: string      = order?.reference ?? "";  // your HMS-xxx-timestamp

  return NextResponse.json({
    ok: true,
    isPaid,
    status,
    noonOrderId,
    capturedAmount,
    currency,
    reference,
  });
}
