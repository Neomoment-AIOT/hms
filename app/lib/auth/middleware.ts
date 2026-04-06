// ═══════════════════════════════════════════════════════════════
// Auth Middleware for Next.js API Routes
// Wraps route handlers that require authentication
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies, type AuthCookies } from "./cookies";

export interface AuthContext {
  sessionToken: string;
  partnerId: number;
}

type AuthenticatedHandler = (
  request: NextRequest,
  auth: AuthContext,
  params?: Record<string, string>
) => Promise<NextResponse>;

/**
 * Higher-order function: wraps a route handler that requires auth.
 * Reads HTTP-only cookies and returns 401 if missing/invalid.
 *
 * Usage:
 * ```ts
 * export const GET = withAuth(async (request, auth) => {
 *   // auth.sessionToken and auth.partnerId are guaranteed
 *   return NextResponse.json({ ok: true });
 * });
 * ```
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const auth = getAuthFromCookies(request);

    if (!auth) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const params = context?.params ? await context.params : undefined;
    return handler(request, auth, params);
  };
}

/**
 * Optional auth: returns auth context or null (doesn't reject).
 * Useful for routes that behave differently for logged-in users.
 */
export function getOptionalAuth(request: NextRequest): AuthCookies | null {
  return getAuthFromCookies(request);
}
