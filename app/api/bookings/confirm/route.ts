import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { ConfirmBookingRequest } from "@/app/lib/odoo/types";

/**
 * POST /api/bookings/confirm
 * Create a new room booking
 * Calls Odoo: POST /api/confirm_room_availability
 */
export const POST = withAuth(async (request: NextRequest, auth) => {
  try {
    const body: ConfirmBookingRequest = await request.json();

    // Validate required fields
    if (!body.check_in_date || !body.check_out_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }
    if (!body.hotel_id) {
      return NextResponse.json(
        { ok: false, error: "Hotel ID is required" },
        { status: 400 }
      );
    }
    if (!body.customer_details?.email || !body.customer_details?.first_name) {
      return NextResponse.json(
        { ok: false, error: "Customer name and email are required" },
        { status: 400 }
      );
    }
    if (!body.rooms || body.rooms.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one room selection is required" },
        { status: 400 }
      );
    }

    const result = await odooPost(
      "/api/confirm_room_availability",
      {
        check_in_date: body.check_in_date,
        check_out_date: body.check_out_date,
        hotel_id: body.hotel_id,
        customer_details: body.customer_details,
        rooms: body.rooms,
        services: body.services || [],
        reference_number: body.reference_number,
        payment_details: body.payment_details,
        reference_booking: body.reference_booking,
        additional_notes: body.additional_notes,
        special_request: body.special_request,
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
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
});
