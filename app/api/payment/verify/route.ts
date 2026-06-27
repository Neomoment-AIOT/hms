import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/verify
 *
 * Calls MyFatoorah GetPaymentStatus to confirm the payment server-side.
 * NEVER trust the status from the browser redirect — always verify here.
 *
 * Body:
 *   paymentId   string   – the paymentId MyFatoorah appends to the callback URL
 *
 * Returns:
 *   { ok: true, isPaid: boolean, status: string, invoiceId: number,
 *     capturedAmount: number, currency: string, reference: string }
 */
export async function POST(request: NextRequest) {
  // ── 1. Read body ─────────────────────────────────────────────────
  let body: { paymentId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { paymentId } = body;
  if (!paymentId) {
    return NextResponse.json({ ok: false, error: "paymentId is required" }, { status: 400 });
  }

  // ── 2. MyFatoorah config ─────────────────────────────────────────
  const apiToken = process.env.MYFATOORAH_API_TOKEN;
  const baseUrl  = (process.env.MYFATOORAH_BASE_URL || "https://apitest.myfatoorah.com").replace(/\/$/, "");

  if (!apiToken) {
    return NextResponse.json({ ok: false, error: "Payment gateway not configured" }, { status: 503 });
  }

  // ── 3. Call MyFatoorah GetPaymentStatus ──────────────────────────
  // KeyType "PaymentId" is the most precise — it's the transaction-level ID
  // appended by MyFatoorah to both CallBackUrl and ErrorUrl as ?paymentId=xxx
  const endpoint = `${baseUrl}/v2/GetPaymentStatus`;
  console.log("[payment/verify] Calling MyFatoorah GetPaymentStatus for paymentId:", paymentId);

  let mfRes: Response;
  try {
    mfRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ Key: paymentId, KeyType: "PaymentId" }),
    });
  } catch (err) {
    console.error("[payment/verify] Network error calling MyFatoorah:", err);
    return NextResponse.json({ ok: false, error: "Payment gateway unreachable" }, { status: 502 });
  }

  const mfData = await mfRes.json();
  console.log("[payment/verify] MyFatoorah response:", JSON.stringify(mfData, null, 2));

  if (!mfRes.ok || !mfData.IsSuccess) {
    console.error("[payment/verify] MyFatoorah error:", JSON.stringify(mfData));
    return NextResponse.json(
      { ok: false, error: mfData?.Message || "Could not retrieve payment status" },
      { status: 502 }
    );
  }

  // ── 4. Inspect payment status ────────────────────────────────────
  // InvoiceStatus values: "Pending" | "Paid" | "Canceled"
  const data           = mfData.Data || {};
  const status: string = data.InvoiceStatus ?? "Pending";
  const isPaid         = status === "Paid";
  const invoiceId      = data.InvoiceId ?? null;
  const reference      = data.CustomerReference ?? "";  // your HMS-xxx-timestamp ref

  // ── Amount: use the DISPLAY amount (SAR), not InvoiceValue (stored in base currency KWD)
  // Priority: transaction PaidCurrencyValue → parsed InvoiceDisplayValue → InvoiceValue
  const transaction    = Array.isArray(data.InvoiceTransactions) ? data.InvoiceTransactions[0] : null;
  const capturedAmount: number =
    (transaction?.PaidCurrencyValue != null ? parseFloat(transaction.PaidCurrencyValue) : null) ??
    (data.InvoiceDisplayValue
      ? parseFloat((data.InvoiceDisplayValue as string).replace(/[^0-9.]/g, ""))
      : null) ??
    data.InvoiceValue ??
    0;

  const currency = transaction?.PaidCurrency || data.CurrencyIso || "SAR";

  return NextResponse.json({
    ok: true,
    isPaid,
    status,
    invoiceId,
    paymentId,
    capturedAmount,
    currency,
    reference,
  });
}
