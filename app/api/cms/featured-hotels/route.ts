import { NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";

export const runtime = "nodejs";

export async function GET() {
  const res = await odooPost<{ status: "success"; hotels: unknown | null }>(
    "/api/public/cms/featured-hotels",
    {}
  );

  if (!res.success) {
    return NextResponse.json(
      { ok: false, error: res.error },
      { status: res.status || 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { ok: true, data: (res.data as { hotels?: unknown | null }).hotels ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
