import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/app/lib/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ ok: true, data: { message: "Signed out" } });
  clearAuthCookies(response);
  return response;
}
