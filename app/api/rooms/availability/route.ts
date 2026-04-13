import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { RoomAvailabilityRequest, RoomAvailabilityResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/rooms/availability
 * Check room availability for a hotel
 * Calls Odoo: POST /api/room_availability
 */
export async function POST(request: NextRequest) {
  try {
    const body: RoomAvailabilityRequest = await request.json();

    if (!body.check_in_date || !body.check_out_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }

    const result = await odooPost<RoomAvailabilityResponse>(
      "/api/room_availability",
      {
        hotel_id: body.hotel_id || 0,
        check_in_date: body.check_in_date,
        check_out_date: body.check_out_date,
        person_count: body.person_count || 1,
        room_count: body.room_count || 1,
        person_email: body.person_email || "",
        person_id: body.person_id || 0,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: result.data.data || [],
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to check room availability" },
      { status: 500 }
    );
  }
}
