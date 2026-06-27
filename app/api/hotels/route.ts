import { NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { HotelListResponse } from "@/app/lib/odoo/types";

export const runtime = "nodejs";
// Avoid any caching (browser or Next route caching). We want CMS/hotel data to reflect Odoo immediately.
export const dynamic = "force-dynamic";

/**
 * GET /api/hotels
 * Returns basic hotel list (id, name, logo, review, star_rating, starting_price)
 * Calls Odoo: POST /api/hotels/list
 */
export async function GET() {
  try {
    const result = await odooPost<HotelListResponse>("/api/hotels/list", {});

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: result.data.hotels || [],
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch hotels" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
