import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { RoomAvailabilityMultipleRequest } from "@/app/lib/odoo/types";

/**
 * POST /api/rooms/availability-multiple
 * Check room availability with multiple pax options
 * Calls Odoo: POST /api/room_availability_multiple
 */
export async function POST(request: NextRequest) {
  try {
    const body: RoomAvailabilityMultipleRequest = await request.json();

    if (!body.check_in_date || !body.check_out_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }
    if (!body.options || !Array.isArray(body.options) || body.options.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one room option is required" },
        { status: 400 }
      );
    }

    const result = await odooPost("/api/room_availability_multiple", {
      hotel_id: body.hotel_id || 0,
      person_id: body.person_id,
      person_email: body.person_email,
      check_in_date: body.check_in_date,
      check_out_date: body.check_out_date,
      options: body.options,
    });

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
      { ok: false, error: "Failed to check room availability" },
      { status: 500 }
    );
  }
}
