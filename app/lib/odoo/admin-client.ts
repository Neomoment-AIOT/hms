// ═══════════════════════════════════════════════════════════════
// Odoo JSON-RPC Admin Client
// Used for admin operations that need server-side Odoo credentials
// (e.g. fetching hotel branches via res.company model)
// ═══════════════════════════════════════════════════════════════

// ─── JSON-RPC core ─────────────────────────────────────────────

export async function odooJsonRpc(
  url: string,
  path: string,
  params: Record<string, unknown>,
  cookie?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(new URL(path, url).toString(), {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: Date.now(),
      params,
    }),
  });

  const cookies = res.headers.getSetCookie?.() ?? [];
  const data = await res.json();

  if (data.error) {
    throw new Error(
      data.error.data?.message || data.error.message || "Odoo RPC error"
    );
  }

  return { result: data.result, cookies };
}

// ─── Admin authenticate (server-side credentials) ──────────────

export async function odooAuthenticate(
  baseUrl: string,
  db: string,
  login: string,
  password: string
) {
  const { result, cookies } = await odooJsonRpc(
    baseUrl,
    "/web/session/authenticate",
    { db, login, password }
  );
  if (!result?.uid) throw new Error("Odoo authentication failed");

  // Extract session cookie
  let sessionCookie = "";
  for (const c of cookies) {
    if (c.includes("session_id")) {
      sessionCookie = c.split(";")[0];
      break;
    }
  }

  return { uid: result.uid as number, sessionCookie };
}

// ─── Generic search_read ───────────────────────────────────────

export async function odooSearchRead(
  baseUrl: string,
  sessionCookie: string,
  model: string,
  domain: unknown[],
  fields: string[],
  limit = 100
) {
  const { result } = await odooJsonRpc(
    baseUrl,
    `/web/dataset/call_kw/${model}/search_read`,
    {
      model,
      method: "search_read",
      args: [domain],
      kwargs: { fields, limit },
    },
    sessionCookie
  );
  return result as Record<string, unknown>[];
}

// ─── Convenience: get admin env vars ───────────────────────────

export function getAdminEnv() {
  const odooUrl = process.env.ODOO_URL;
  const odooDb = process.env.ODOO_DB;
  const odooUser = process.env.ODOO_USERNAME;
  const odooPass = process.env.ODOO_PASSWORD;

  if (!odooUrl || !odooDb || !odooUser || !odooPass) {
    return null;
  }

  return { odooUrl, odooDb, odooUser, odooPass };
}
