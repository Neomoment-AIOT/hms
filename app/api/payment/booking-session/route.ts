import { NextRequest, NextResponse } from "next/server";
import { saveBookingSession, type BookingSession } from "@/app/lib/payment/booking-store";

/**
 * POST /api/payment/booking-session
 *
 * Called by GuestDetailsPage BEFORE redirecting to MyFatoorah.
 * Saves the full booking snapshot server-side so the webhook can
 * retrieve it later using CustomerReference (orderRef).
 *
 * Body: BookingSession (minus savedAt — added here)
 */
export async function POST(request: NextRequest) {
  let body: Omit<BookingSession, "savedAt">;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.orderRef) {
    return NextResponse.json({ ok: false, error: "orderRef is required" }, { status: 400 });
  }

  saveBookingSession({ ...body, savedAt: Date.now() });

  console.log("[booking-session] Saved session for orderRef:", body.orderRef);

  return NextResponse.json({ ok: true });
}
