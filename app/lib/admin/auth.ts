import { NextRequest } from "next/server";

export const ADMIN_COOKIE_SESSION = "hms_admin_session";
export const ADMIN_COOKIE_UID = "hms_admin_uid";
export const ADMIN_COOKIE_EMAIL = "hms_admin_email";
export const ADMIN_COOKIE_CSRF = "hms_admin_csrf";

export type AdminSession = {
  sessionId: string;
  uid?: number;
  email?: string;
};

export function getAdminSession(request: NextRequest): AdminSession | null {
  const sessionId = request.cookies.get(ADMIN_COOKIE_SESSION)?.value;
  if (!sessionId) return null;

  const uidStr = request.cookies.get(ADMIN_COOKIE_UID)?.value;
  const email = request.cookies.get(ADMIN_COOKIE_EMAIL)?.value;

  return {
    sessionId,
    uid: uidStr ? Number(uidStr) : undefined,
    email: email || undefined,
  };
}

export function requireAdminSession(request: NextRequest): AdminSession {
  const s = getAdminSession(request);
  if (!s) {
    const err = new Error("Admin authentication required");
    // @ts-expect-error augment for route handlers
    err.statusCode = 401;
    throw err;
  }
  return s;
}

export function assertAdminCsrf(request: NextRequest) {
  const cookieToken = request.cookies.get(ADMIN_COOKIE_CSRF)?.value;
  const headerToken = request.headers.get("x-csrf-token");

  // Only enforce if the cookie exists (it will after login).
  if (!cookieToken) {
    const err = new Error("CSRF cookie missing");
    // @ts-expect-error augment for route handlers
    err.statusCode = 403;
    throw err;
  }

  if (!headerToken || headerToken !== cookieToken) {
    const err = new Error("CSRF token invalid");
    // @ts-expect-error augment for route handlers
    err.statusCode = 403;
    throw err;
  }
}

export function isAdminEmailAllowed(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS || "";
  const allowed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Secure-by-default: if ADMIN_EMAILS is not configured, don't allow login.
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

