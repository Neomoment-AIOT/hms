import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { UpdatePaymentRequest, UpdatePaymentResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/payments/update
 * Update payment status for a booking
 * Calls Odoo: POST /api/update_room_payment
 */
export const POST = withAuth(async (request: NextRequest, auth) => {
  try {
    const body: UpdatePaymentRequest = await request.json();

    if (!body.booking_id || !body.payment_id) {
      return NextResponse.json(
        { ok: false, error: "Booking ID and payment ID are required" },
        { status: 400 }
      );
    }
    if (!body.payment_status) {
      return NextResponse.json(
        { ok: false, error: "Payment status is required" },
        { status: 400 }
      );
    }

    const result = await odooPost<UpdatePaymentResponse>(
      "/api/update_room_payment",
      {
        payment_id: body.payment_id,
        booking_id: body.booking_id,
        payment_type: body.payment_type,
        payment_status: body.payment_status,
      },
      auth.sessionToken
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { message: result.data.message || "Payment updated" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update payment" },
      { status: 500 }
    );
  }
});
