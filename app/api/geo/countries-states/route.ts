import { NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";

/**
 * GET /api/geo/countries-states
 *
 * Proxies to Odoo: POST /api/country/state/list
 *
 * The Odoo route now accepts methods=['GET', 'POST'] (type='json'),
 * so we can use odooPost which sends a standard JSON-RPC POST body.
 */
export async function GET() {
  try {
    const result = await odooPost("/api/country/state/list", {});

    if (!result.success) {
      console.error("[countries-states] Odoo call failed:", result.error);
      return NextResponse.json(
        { ok: false, error: "Odoo gateway error" },
        { status: 502 }
      );
    }

    const data = result.data as Record<string, unknown>;
    const countries = (data?.countries ?? []) as unknown[];

    return NextResponse.json({ ok: true, data: countries });

  } catch (err) {
    console.error("[countries-states] Fetch failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
