import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/app/lib/odoo/client";
import { withAuth } from "@/app/lib/auth/middleware";

/**
 * GET /api/bookings/pdf?booking_ids=1,2,3
 * Download booking PDF
 * Calls Odoo: GET /generate/bookings_pdf?booking_ids=X
 */
export const GET = withAuth(async (request: NextRequest, auth) => {
  try {
    const bookingIds = request.nextUrl.searchParams.get("booking_ids");
    const companyId = request.nextUrl.searchParams.get("company_id");

    if (!bookingIds) {
      return NextResponse.json(
        { ok: false, error: "booking_ids query parameter is required" },
        { status: 400 }
      );
    }

    const query: Record<string, string> = { booking_ids: bookingIds };
    if (companyId) query.company_id = companyId;

    const result = await odooFetch("/generate/bookings_pdf", {
      method: "GET",
      query,
      sessionToken: auth.sessionToken,
      timeout: 30_000, // PDFs can take longer
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    // Check if binary response
    const data = result.data as { _binary?: boolean; contentType?: string; buffer?: Buffer };
    if (data._binary && data.buffer) {
      const uint8 = new Uint8Array(data.buffer);
      return new NextResponse(uint8, {
        headers: {
          "Content-Type": data.contentType || "application/pdf",
          "Content-Disposition": `attachment; filename="booking_${bookingIds}.pdf"`,
        },
      });
    }

    // Fallback: JSON response
    return NextResponse.json({ ok: true, data: result.data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to generate booking PDF" },
      { status: 500 }
    );
  }
});
