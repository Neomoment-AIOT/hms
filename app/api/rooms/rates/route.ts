import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { RoomRatesRequest, RoomRatesResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/rooms/rates
 * Get pricing for a room type
 * Calls Odoo: POST /api/room_rates
 */
export async function POST(request: NextRequest) {
  try {
    const body: RoomRatesRequest = await request.json();

    if (!body.room_type_id) {
      return NextResponse.json(
        { ok: false, error: "Room type ID is required" },
        { status: 400 }
      );
    }
    if (!body.check_in_date || !body.check_out_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }

    const result = await odooPost<RoomRatesResponse>("/api/room_rates", {
      room_type_id: body.room_type_id,
      total_person_count: body.total_person_count || 1,
      total_child_count: body.total_child_count || 0,
      check_in_date: body.check_in_date,
      check_out_date: body.check_out_date,
      person_email: body.person_email || "",
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: result.data.rates || [],
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch room rates" },
      { status: 500 }
    );
  }
}
