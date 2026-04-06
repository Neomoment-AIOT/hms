import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { RetrieveBookingResponse } from "@/app/lib/odoo/types";

/**
 * GET /api/bookings
 * Get bookings for the authenticated user
 * Calls Odoo: POST /api/retrieve_room_booking (with partner_id from cookies)
 */
export const GET = withAuth(async (_request: NextRequest, auth) => {
  try {
    const result = await odooPost<RetrieveBookingResponse>(
      "/api/retrieve_room_booking",
      { partner_id: auth.partnerId },
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
});
