import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;

  const res = await odooPost<{ status: "success"; post?: unknown | null; message?: string }>(
    "/api/public/cms/blogs/by-slug",
    { slug }
  );

  if (!res.success) {
    return NextResponse.json(
      { ok: false, error: res.error },
      { status: res.status || 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  const result = res.data as { status?: string; post?: unknown | null; message?: string };
  if (result.status !== "success") {
    return NextResponse.json(
      { ok: false, error: result.message || "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { ok: true, data: result.post ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}

