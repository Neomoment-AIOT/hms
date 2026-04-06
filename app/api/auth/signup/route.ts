import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import type { SignUpRequest, SignUpResponse } from "@/app/lib/odoo/types";

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json();

    // Validate required fields
    if (!body.password) {
      return NextResponse.json(
        { ok: false, error: "Password is required" },
        { status: 400 }
      );
    }
    if (!body.email && !body.mobile) {
      return NextResponse.json(
        { ok: false, error: "Email or mobile is required" },
        { status: 400 }
      );
    }

    const result = await odooPost<SignUpResponse>("/api/signup", {
      email: body.email,
      mobile: body.mobile,
      password: body.password,
      name: body.name,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        message: result.data.message,
        partner_id: result.data.partner_id,
        email: result.data.email,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
