// ═══════════════════════════════════════════════════════════════
// Auth Cookie Management
// HTTP-only cookies for Odoo session token + partner ID
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

const COOKIE_SESSION = "odoo_session_token";
const COOKIE_PARTNER = "odoo_partner_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthCookies {
  sessionToken: string;
  partnerId: number;
}

/**
 * Set HTTP-only auth cookies on a NextResponse.
 */
export function setAuthCookies(
  response: NextResponse,
  sessionToken: string,
  partnerId: number
): NextResponse {
  response.cookies.set(COOKIE_SESSION, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  response.cookies.set(COOKIE_PARTNER, String(partnerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}

/**
 * Clear auth cookies (sign-out).
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_SESSION, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(COOKIE_PARTNER, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

/**
 * Read auth cookies from an incoming request.
 * Returns null if either cookie is missing.
 */
export function getAuthFromCookies(
  request: NextRequest
): AuthCookies | null {
  const sessionToken = request.cookies.get(COOKIE_SESSION)?.value;
  const partnerIdStr = request.cookies.get(COOKIE_PARTNER)?.value;

  if (!sessionToken || !partnerIdStr) return null;

  const partnerId = parseInt(partnerIdStr, 10);
  if (isNaN(partnerId)) return null;

  return { sessionToken, partnerId };
}
