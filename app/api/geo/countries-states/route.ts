import { NextResponse } from "next/server";
import { odooGet } from "@/app/lib/odoo/client";
import type { CountryStateListResponse } from "@/app/lib/odoo/types";

/**
 * GET /api/geo/countries-states
 * Get list of countries and their states
 * Calls Odoo: GET /api/country/state/list
 */
export async function GET() {
  try {
    const result = await odooGet<CountryStateListResponse>(
      "/api/country/state/list"
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: result.data.countries || [],
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch countries and states" },
      { status: 500 }
    );
  }
}
