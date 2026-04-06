import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { RetrieveBookingResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/bookings/retrieve
 * Retrieve bookings by email (public, no auth required)
 * Calls Odoo: POST /api/retrieve_room_booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.partner_email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await odooPost<RetrieveBookingResponse>(
      "/api/retrieve_room_booking",
      { partner_email: body.partner_email }
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        bookings: result.data.bookings_data || [],
        group_bookings: result.data.group_bookings_data || [],
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to retrieve bookings" },
      { status: 500 }
    );
  }
}
