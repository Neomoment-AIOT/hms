import { NextRequest, NextResponse } from "next/server";
import { odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { OdooResponse } from "@/app/lib/odoo/types";

export const POST = withAuth(async (request: NextRequest, auth) => {
  try {
    const body = await request.json();

    if (!body.old_password || !body.new_password) {
      return NextResponse.json(
        { ok: false, error: "Old and new passwords are required" },
        { status: 400 }
      );
    }

    // Email comes from auth context (partner lookup), but Odoo API
    // needs the email. We'll pass it from the client for now since
    // Odoo's endpoint expects it.
    if (!body.email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await odooPost<OdooResponse>(
      "/api/change_contact_password",
      {
        email: body.email,
        old_password: body.old_password,
        new_password: body.new_password,
      },
      auth.sessionToken
    );

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { message: "Password changed successfully" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});
