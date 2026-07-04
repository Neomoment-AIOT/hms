import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/images?model=<model>&id=<id>&field=<field>
 *
 * Proxies image requests to Odoo's /web/image endpoint.
 * This avoids embedding large base64 blobs in JSON API responses,
 * which caused timeouts in /api/rooms/availability and similar.
 *
 * Examples:
 *   /api/images?model=res.company&id=17&field=logo
 *   /api/images?model=room.type.image&id=42&field=image
 *
 * Responses are cached for 1 day (images rarely change).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model");
  const id    = searchParams.get("id");
  const field = searchParams.get("field");

  if (!model || !id || !field) {
    return new NextResponse(null, { status: 400 });
  }

  const odooUrl = process.env.ODOO_URL || "http://localhost:8069";
  const imageUrl = `${odooUrl}/web/image/${encodeURIComponent(model)}/${encodeURIComponent(id)}/${encodeURIComponent(field)}`;

  try {
    const res = await fetch(imageUrl, {
      headers: { "Accept": "image/*" },
      // 10s is plenty — Odoo image endpoint is fast (just a DB read + resize)
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const contentType = res.headers.get("Content-Type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
