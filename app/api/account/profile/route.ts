import { NextRequest, NextResponse } from "next/server";
import { odooGet, odooPost } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";
import type { PartnerResponse, PartnerUpdateRequest, OdooResponse } from "@/app/lib/odoo/types";

/**
 * GET /api/account/profile
 * Get the authenticated user's profile from Odoo
 * Calls Odoo: GET /api/get/partner?partner_id=X
 */
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
      { ok: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/account/profile
 * Update the authenticated user's profile
 * Calls Odoo: POST /api/update_contact_data
 */
export const PUT = withAuth(async (request: NextRequest, auth) => {
  try {
    const body: Omit<PartnerUpdateRequest, "partner_id"> = await request.json();

    const result = await odooPost<OdooResponse>(
      "/api/update_contact_data",
      {
        partner_id: auth.partnerId,
        name: body.name,
        state_id: body.state_id,
        country_id: body.country_id,
        website: body.website,
        street: body.street,
        street2: body.street2,
        zip: body.zip,
        city: body.city,
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
      data: { message: "Profile updated successfully" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
});
