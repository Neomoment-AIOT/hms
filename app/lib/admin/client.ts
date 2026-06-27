"use client";

import { ADMIN_COOKIE_CSRF } from "./auth";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export function getAdminCsrfToken(): string | null {
  return readCookie(ADMIN_COOKIE_CSRF);
}

export async function adminJsonFetch<T>(
  url: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const method = (init.method || "GET").toUpperCase();
  const isMutating = method !== "GET" && method !== "HEAD";

  if (isMutating) {
    headers.set("Content-Type", "application/json");
    const csrf = getAdminCsrfToken();
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  const parsed = (await res.json().catch(() => null)) as unknown;

  const asObj =
    parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;

  if (!res.ok) {
    const err =
      (typeof asObj?.error === "string" && asObj.error) ||
      (typeof asObj?.message === "string" && asObj.message) ||
      `Request failed (${res.status})`;
    throw new Error(err);
  }

  if (parsed === null) throw new Error("Invalid JSON response");
  return parsed as T;
}
