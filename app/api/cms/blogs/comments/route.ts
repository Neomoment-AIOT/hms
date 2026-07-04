import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() || "";

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Missing slug" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const res = await odooPost<{ status: string; count?: number; comments?: unknown; message?: string }>(
    "/api/public/cms/blogs/comments/list",
    { slug }
  );

  if (!res.success) {
    return NextResponse.json(
      { ok: false, error: res.error },
      { status: res.status || 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  if ((res.data as { status?: string }).status !== "success") {
    return NextResponse.json(
      { ok: false, error: (res.data as { message?: string }).message || "Odoo error" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        count: (res.data as { count?: number }).count ?? 0,
        comments: (res.data as { comments?: unknown }).comments ?? [],
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { slug?: string; name?: string; email?: string; message?: string }
    | null;

  if (!body?.slug || !body?.name || !body?.message) {
    return NextResponse.json(
      { ok: false, error: "Missing slug, name, or message" },
      { status: 400 }
    );
  }

  const res = await odooPost<{ status: string; message?: string }>(
    "/api/public/cms/blogs/comments/add",
    {
      slug: body.slug,
      name: body.name,
      email: body.email || "",
      message: body.message,
    }
  );

  if (!res.success) {
    return NextResponse.json(
      { ok: false, error: res.error },
      { status: res.status || 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  if ((res.data as { status?: string }).status !== "success") {
    return NextResponse.json(
      { ok: false, error: (res.data as { message?: string }).message || "Odoo error" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { ok: true, message: (res.data as { message?: string }).message || "OK" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
