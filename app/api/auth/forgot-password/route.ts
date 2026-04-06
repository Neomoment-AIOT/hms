import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { ForgotPasswordRequest, OdooResponse } from "@/app/lib/odoo/types";

export async function POST(request: NextRequest) {
  try {
    const body: ForgotPasswordRequest = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await odooPost<OdooResponse>("/api/forget_password", {
      email: body.email,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { message: result.data.message || "Password reset email sent" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
