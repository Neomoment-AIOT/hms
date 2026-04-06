import { NextRequest, NextResponse } from "next/server";
import { odooGet } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { PartnerResponse } from "@/app/lib/odoo/types";

export const GET = withAuth(async (_request: NextRequest, auth) => {
  try {
    const result = await odooGet<PartnerResponse>(
      "/api/get/partner",
      { partner_id: String(auth.partnerId) },
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
      data: result.data.partner_data || null,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});
