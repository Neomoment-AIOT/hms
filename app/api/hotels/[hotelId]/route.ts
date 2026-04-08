import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { HotelSearchRequest, HotelSearchResponse } from "@/app/lib/odoo/types";

/**
 * POST /api/hotels/[hotelId]
 * Get single hotel details with availability
 * Calls Odoo: POST /api/hotel/<hotel_id>
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  try {
    const { hotelId } = await params;
    const body: HotelSearchRequest = await request.json();

    if (!body.checkin_date || !body.checkout_date) {
      return NextResponse.json(
        { ok: false, error: "Check-in and check-out dates are required" },
        { status: 400 }
      );
    }

    const result = await odooPost<HotelSearchResponse>(
      `/api/hotel/${hotelId}`,
      {
        checkin_date: body.checkin_date,
        checkout_date: body.checkout_date,
        room_count: body.room_count || 1,
        adult_count: body.adult_count || 1,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    // Odoo returns hotels as an OBJECT for single hotel, or ARRAY for multiple
    const hotelsData = result.data.hotels;
    const hotel = Array.isArray(hotelsData) ? hotelsData[0] : hotelsData || null;

    return NextResponse.json({
      ok: true,
      data: {
        hotel,
        services: result.data.services || [],
        meals: result.data.meals || [],
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch hotel details" },
      { status: 500 }
    );
  }
}
