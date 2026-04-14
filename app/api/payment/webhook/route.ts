import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

/**
 * POST /api/payment/webhook
 *
 * Noon calls this URL server-to-server whenever an order status changes.
 * This is independent of the browser returnUrl — it fires even if the user
 * closes their browser mid-redirect.
 *
 * Register this URL in Noon Dashboard → Integration → Webhooks:
 *   Test:  http://<your-ngrok>.ngrok.io/api/payment/webhook
 *   Live:  https://yourdomain.com/api/payment/webhook
 *
 * Noon expects a 200 response within 10 seconds — if it doesn't get one it
 * will retry up to 5 times with exponential back-off.
 *
 * TODO (when ready to implement):
 *   - On status CAPTURED  → create/confirm booking in Odoo
 *   - On status FAILED    → release any held inventory
 *   - On status REFUNDED  → cancel booking, notify guest
 */

export async function POST(request: NextRequest) {
  // ── 1. Read raw body (needed for signature verification) ─────────
  const rawBody = await request.text();

  // ── 2. Verify Noon signature ─────────────────────────────────────
  // Noon sends: Authorization: Key_Test {businessId}.{appId}:{signature}
  // where signature = HMAC-SHA256(rawBody, appKey)
  const authHeader = request.headers.get("Authorization") || "";
  const appKey     = process.env.NOON_APP_KEY || "";

  let signatureValid = false;

  if (appKey && authHeader) {
    try {
      // Extract the signature portion after the last ":"
      const signaturePart = authHeader.split(":").pop() || "";
      const expected = createHmac("sha256", appKey)
        .update(rawBody)
        .digest("hex");
      signatureValid = expected === signaturePart;
    } catch {
      signatureValid = false;
    }
  }

  // ── 3. Parse payload ─────────────────────────────────────────────
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[webhook/noon] Failed to parse body:", rawBody);
    // Still return 200 so Noon doesn't keep retrying a malformed request
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 4. LOG EVERYTHING (temporary — replace with business logic) ──
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("[webhook/noon] Received at:", new Date().toISOString());
  console.log("[webhook/noon] Authorization header:", authHeader);
  console.log("[webhook/noon] Signature valid:", signatureValid);
  console.log("[webhook/noon] Full payload:");
  console.log(JSON.stringify(payload, null, 2));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Useful fields to log individually for quick scanning
  const order   = (payload.order   as Record<string, unknown>) || {};
  const result  = (payload.result  as Record<string, unknown>) || {};

  console.log("[webhook/noon] orderId:    ", order.id);
  console.log("[webhook/noon] reference:  ", order.reference);   // your HMS-xxx-timestamp
  console.log("[webhook/noon] status:     ", order.status);      // CAPTURED / FAILED etc.
  console.log("[webhook/noon] amount:     ", order.amount, order.currency);
  console.log("[webhook/noon] resultCode: ", result.code);
  console.log("[webhook/noon] resultMsg:  ", result.message);

  // ── 5. TODO: Business logic goes here ────────────────────────────
  // const status = order.status as string;
  // if (status === "CAPTURED") {
  //   await confirmBookingInOdoo(order.reference as string, order.id as number);
  // } else if (status === "REFUNDED" || status === "REVERSED") {
  //   await cancelBookingInOdoo(order.reference as string);
  // }

  // ── 6. Always return 200 immediately ─────────────────────────────
  // Noon retries if it gets anything other than 2xx
  return NextResponse.json({ received: true }, { status: 200 });
}
