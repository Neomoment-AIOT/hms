// ═══════════════════════════════════════════════════════════════
// Odoo REST API Client
// Used for customer-facing REST endpoints (POST /api/*)
// NOT for JSON-RPC admin calls — see admin-client.ts for those
// ═══════════════════════════════════════════════════════════════

const ODOO_BASE_URL = process.env.ODOO_URL || "";
const DEFAULT_TIMEOUT = 15_000; // 15 seconds
const MAX_RETRIES = 1;

export interface OdooFetchOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  sessionToken?: string;
  query?: Record<string, string>;
  timeout?: number;
}

export interface OdooFetchSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface OdooFetchError {
  success: false;
  error: string;
  status: number;
}

export type OdooFetchResult<T = unknown> = OdooFetchSuccess<T> | OdooFetchError;

/**
 * Makes a request to the Odoo REST API.
 *
 * @param path  – e.g. "/api/signin" or "/api/hotels/list"
 * @param opts  – method, body, sessionToken, query params, timeout
 */
export async function odooFetch<T = unknown>(
  path: string,
  opts: OdooFetchOptions = {}
): Promise<OdooFetchResult<T>> {
  const {
    method = "POST",
    body,
    sessionToken,
    query,
    timeout = DEFAULT_TIMEOUT,
  } = opts;

  if (!ODOO_BASE_URL) {
    return { success: false, error: "ODOO_URL is not configured", status: 500 };
  }

  // Build URL
  const url = new URL(path, ODOO_BASE_URL);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      url.searchParams.set(k, v);
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionToken) {
    headers["Cookie"] = `session_id=${sessionToken}`;
  }

  // Build request init
  const init: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(timeout),
  };
  if (body && method === "POST") {
    init.body = JSON.stringify(body);
  }

  // Execute with retry
  let lastError = "";
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url.toString(), init);

      // Retry on 5xx
      if (res.status >= 500 && attempt < MAX_RETRIES) {
        lastError = `Odoo returned ${res.status}`;
        await delay(1000 * (attempt + 1)); // exponential backoff
        continue;
      }

      // For PDF/binary responses, return the raw response wrapped
      const contentType = res.headers.get("content-type") || "";
      if (
        contentType.includes("application/pdf") ||
        contentType.includes("application/zip")
      ) {
        // Return a special marker so callers know it's binary
        return {
          success: true,
          data: {
            _binary: true,
            contentType,
            buffer: Buffer.from(await res.arrayBuffer()),
          } as unknown as T,
        };
      }

      // Parse JSON
      const json = await res.json();

      if (json.status === "error") {
        return {
          success: false,
          error: json.message || "Odoo returned an error",
          status: res.status,
        };
      }

      return { success: true, data: json as T };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        lastError = `Request to ${path} timed out after ${timeout}ms`;
      } else {
        lastError = err instanceof Error ? err.message : String(err);
      }

      if (attempt < MAX_RETRIES) {
        await delay(1000 * (attempt + 1));
        continue;
      }
    }
  }

  return { success: false, error: lastError, status: 502 };
}

// ─── Helpers ───────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convenience: POST to Odoo REST endpoint.
 */
export function odooPost<T = unknown>(
  path: string,
  body: Record<string, unknown>,
  sessionToken?: string
) {
  return odooFetch<T>(path, { method: "POST", body, sessionToken });
}

/**
 * Convenience: GET from Odoo REST endpoint.
 */
export function odooGet<T = unknown>(
  path: string,
  query?: Record<string, string>,
  sessionToken?: string
) {
  return odooFetch<T>(path, { method: "GET", query, sessionToken });
}
