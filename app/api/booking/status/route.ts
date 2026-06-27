import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { getBookingSession } from "@/app/lib/payment/booking-store";

/**
 * GET /api/booking/status?orderRef=HMS-17-xxxxxxx
 *
 * Polls Odoo for booking details by the web reference number (ref_id_bk).
 * Called by the PaymentSuccess page to:
 *   1. Wait until the webhook has created the booking in Odoo
 *   2. Display the confirmed booking details
 *   3. Fall back to "Under Review" if not confirmed within timeout
 *
 * Returns:
 *   { status: "not_found" }                       – booking not yet created
 *   { status: "found", booking: { ... } }          – booking exists (check booking.state)
 *   { status: "error", message: string }            – Odoo unreachable
 */
export async function GET(request: NextRequest) {
  const orderRef = request.nextUrl.searchParams.get("orderRef");

  if (!orderRef) {
    return NextResponse.json(
      { status: "error", message: "orderRef query param is required" },
      { status: 400 }
    );
  }

  try {
    const result = await odooPost("/api/booking/details", {
      reference_number: orderRef,
    });

    if (!result.success) {
      console.error("[booking/status] Odoo error:", result.error);
      return NextResponse.json(
        { status: "error", message: result.error },
        { status: 502 }
      );
    }

    const data = result.data as Record<string, unknown>;

    // Patch amount_total from the in-memory session — Odoo's DB field
    // (total_rate_after_discount) stays 0 until the record is opened in Odoo UI.
    if (data.status === "found" && data.booking) {
      const session = getBookingSession(orderRef);
      if (session) {
        (data.booking as Record<string, unknown>).amount_total = session.amount;
      }
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("[booking/status] Unexpected error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch booking status" },
      { status: 500 }
    );
  }
}
