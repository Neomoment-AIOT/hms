import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";

/**
 * POST /api/bookings/[bookingId]/cancel
 * Cancel a booking
 * Calls Odoo: POST /api/cancel_room_booking
 */
export const POST = withAuth(
  async (_request: NextRequest, auth, params) => {
    try {
      const bookingId = params?.bookingId;

      if (!bookingId) {
        return NextResponse.json(
          { ok: false, error: "Booking ID is required" },
          { status: 400 }
        );
      }

      const result = await odooPost(
        "/api/cancel_room_booking",
        { booking_id: parseInt(bookingId, 10) },
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
        data: { message: "Booking cancelled successfully" },
      });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Failed to cancel booking" },
        { status: 500 }
      );
    }
  }
);
