import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { setAuthCookies } from "@/app/lib/auth/cookies";
import type { SignInRequest, SignInResponse } from "@/app/lib/odoo/types";

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json();

    // Validate
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

    const result = await odooPost<SignInResponse>("/api/signin", {
      email: body.email,
      mobile: body.mobile,
      password: body.password,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 401 }
      );
    }

    const { session_token, partner_id, email } = result.data;

    if (!session_token || !partner_id) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set HTTP-only cookies and return user info
    const response = NextResponse.json({
      ok: true,
      data: {
        partner_id,
        email: email || body.email,
        name: result.data.message || "",
      },
    });

    setAuthCookies(response, session_token, partner_id);

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
