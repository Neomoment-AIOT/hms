import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { getAuthFromCookies } from "@/app/lib/auth/cookies";
import type { HotelSearchRequest, HotelSearchResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/hotels/search
 * Search hotels with availability (check-in, check-out, room count, adults)
 * Calls Odoo: POST /api/hotels
 */
export async function POST(request: NextRequest) {
  try {
    const body: HotelSearchRequest = await request.json();

    // Validate required fields
    if (!body.checkin_date || !body.checkout_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }
    if (!body.room_count || body.room_count < 1) {
      return NextResponse.json(
        { ok: false, error: "Room count must be at least 1" },
        { status: 400 }
      );
    }
    if (!body.adult_count || body.adult_count < 1) {
      return NextResponse.json(
        { ok: false, error: "Adult count must be at least 1" },
        { status: 400 }
      );
    }

    // Read partner_id from HTTP-only cookie — authoritative, cannot be spoofed
    const auth = getAuthFromCookies(request);
    const person_id = auth?.partnerId || 0;

    const result = await odooPost<HotelSearchResponse>("/api/hotels", {
      checkin_date: body.checkin_date,
      checkout_date: body.checkout_date,
      room_count: body.room_count,
      adult_count: body.adult_count,
      person_email: body.person_email || "",
      person_id,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        hotels: result.data.hotels || [],
        services: result.data.services || [],
        meals: result.data.meals || [],
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to search hotels" },
      { status: 500 }
    );
  }
}
