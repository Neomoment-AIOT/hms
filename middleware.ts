import { NextRequest, NextResponse } from "next/server";

/**
 * Admin area hard-gate.
 *
 * We still keep client-side guards for UX, but middleware prevents:
 * - Direct navigation to /admin/* pages without a valid admin session cookie
 * - Accidental indexing/caching of admin pages
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the admin UI (not the public site).
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page.
  if (pathname === "/admin/login") return NextResponse.next();

  // Require admin session cookie.
  const adminSession = request.cookies.get("hms_admin_session")?.value;
  if (!adminSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  // Reduce caching risk for admin content.
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};

