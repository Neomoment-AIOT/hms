import { NextRequest, NextResponse } from "next/server";
import { getBookingSession } from "@/app/lib/payment/booking-store";
import { odooFetch } from "@/app/lib/odoo/client";

/**
 * POST /api/payment/webhook
 *
 * MyFatoorah calls this server-to-server when invoice status changes.
 * Passed per-request via WebhookUrl in ExecutePayment.
 *
 * On TransactionStatus SUCCESS:
 *   1. Looks up the booking session saved before payment redirect
 *   2. Builds the confirm_room_availability payload
 *   3. Calls Odoo to create + confirm the booking
 *   4. Cleans up the session entry
 *
 * Always returns 200 immediately — MyFatoorah retries on non-200.
 */

export async function POST(request: NextRequest) {
  // ── 1. Parse body ─────────────────────────────────────────────────
  const rawBody = await request.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[webhook] Failed to parse body:", rawBody);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 2. Extract MyFatoorah fields ─────────────────────────────────
  const data              = (payload.Data as Record<string, unknown>) || {};
  const invoiceId         = data.InvoiceId;
  const transactionStatus = (data.TransactionStatus as string || "").toUpperCase();
  const customerRef       = data.CustomerReference as string || "";
  const paymentId         = data.PaymentId         as string || "";
  const paymentMethod     = data.PaymentMethod      as string || "";
  const paidAmount        = data.InvoiceValueInDisplayCurreny as string || "0";
  const displayCurrency   = data.DisplayCurrency   as string || "SAR";

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("[webhook] Received at:         ", new Date().toISOString());
  console.log("[webhook] InvoiceId:           ", invoiceId);
  console.log("[webhook] TransactionStatus:   ", transactionStatus);
  console.log("[webhook] CustomerReference:   ", customerRef);
  console.log("[webhook] PaymentId:           ", paymentId);
  console.log("[webhook] PaymentMethod:       ", paymentMethod);
  console.log("[webhook] PaidAmount:          ", paidAmount, displayCurrency);

  // ── 3. Only proceed on SUCCESS ────────────────────────────────────
  if (transactionStatus !== "SUCCESS") {
    console.log("[webhook] Skipping — status:", transactionStatus);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 4. Look up booking session ────────────────────────────────────
  const session = getBookingSession(customerRef);

  if (!session) {
    console.warn("[webhook] ⚠ No booking session for ref:", customerRef, "— session expired or missing");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 5. Build confirm_room_availability payload ────────────────────
  const confirmPayload = {
    check_in_date:  session.checkIn,
    check_out_date: session.checkOut,
    hotel_id:       session.hotelId,
    room_count:     session.roomCount,

    customer_details: {
      first_name: session.guestFirstName,
      last_name:  session.guestLastName,
      email:      session.guestEmail,
      mobile:     session.guestMobile || session.guestEmail,
      contact:    session.guestMobile || session.guestEmail,
    },

    rooms: [
      {
        room_type_id:   session.roomTypeId,
        pax:            session.pax,
        adults:         session.adults,
        children:       session.children,
        // nationality goes here — Odoo reads adult_details[0].nationality
        // to set it on the partner before calling action_confirm()
        adult_details: session.adults > 0 ? [
          {
            firstName:   session.guestFirstName,
            lastName:    session.guestLastName,
            nationality: session.guestCountry || "",
            idType:      "",
            id:          "",
            relation:    "",   // Selection field: son/daughter/wife/etc — leave blank for primary guest
            phone:       session.guestMobile || "",
          },
        ] : [],
      },
    ],

    // services: session.meals.map((m) => ({
    //   type:   1,
    //   title:  m.description,
    //   option: "",
    // })),
    services: [],

    meal_pattern_id: session.mealPatternId,

    reference_number: session.orderRef,

    payment_details: {
      success:        true,
      is_paid:        true,
      status:         "captured",
      payment_method: paymentMethod,
      invoice_id:     invoiceId,
      payment_id:     paymentId,
      paid_amount:    parseFloat(paidAmount),
      currency:       displayCurrency,
    },
  };

  console.log("[webhook] ✅ Calling Odoo confirm_room_availability...");
  console.log("[webhook] Payload:", JSON.stringify(confirmPayload, null, 2));

  // ── 6. Call Odoo — auth='public' so no session token needed ──────
  // Use 90s timeout: action_confirm() in Odoo does heavy work (split rooms,
  // folio lines, payment posting) and takes 20–40s — well above the 15s default.
  try {
    const result = await odooFetch(
      "/api/confirm_room_availability",
      {
        method: "POST",
        body: confirmPayload as unknown as Record<string, unknown>,
        timeout: 90_000,
      }
    );

    if (!result.success) {
      console.error("[webhook] ❌ Odoo call failed:", result.error);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const odooData = result.data as Record<string, unknown>;
    console.log("[webhook] Odoo raw response:", JSON.stringify(odooData, null, 2));

    if (odooData?.status === "success") {
      console.log("[webhook] ✅ Booking created in Odoo! booking_id:", odooData.booking_id);
      // Keep session alive so /api/booking/status can read session.amount
      // (Odoo's amount_total stays 0 until record is opened). TTL (2h) will expire it.
    } else {
      console.error("[webhook] ❌ Odoo returned error:", odooData?.message);
    }

  } catch (err) {
    console.error("[webhook] ❌ Exception calling Odoo:", err);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  return NextResponse.json({ received: true }, { status: 200 });
}
