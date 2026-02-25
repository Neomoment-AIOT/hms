import { NextResponse } from "next/server";

// ─── Odoo JSON-RPC Helper (session-based auth) ──────────────

async function odooJsonRpc(
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

async function odooAuthenticate(baseUrl: string, db: string, login: string, password: string) {
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

async function odooSearchRead(
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

// ─── GET /api/admin/odoo/hotels ─────────────────────────────

export async function GET() {
  const odooUrl = process.env.ODOO_URL;
  const odooDb = process.env.ODOO_DB;
  const odooUser = process.env.ODOO_USERNAME;
  const odooPass = process.env.ODOO_PASSWORD;

  if (!odooUrl || !odooDb || !odooUser || !odooPass) {
    return NextResponse.json({
      source: "fallback",
      parentCompany: null,
      hotels: [],
      error: "Odoo credentials not configured in .env.local",
    });
  }

  try {
    // 1. Authenticate
    const { sessionCookie } = await odooAuthenticate(
      odooUrl,
      odooDb,
      odooUser,
      odooPass
    );

    // 2. Fetch all companies
    const companies = await odooSearchRead(
      odooUrl,
      sessionCookie,
      "res.company",
      [],
      [
        "id",
        "name",
        "display_name",
        "parent_id",
        "child_ids",
        "street",
        "street2",
        "city",
        "state_id",
        "country_id",
        "zip",
        "phone",
        "mobile",
        "email",
        "website",
        "currency_id",
        "logo_web",
      ]
    );

    // 3. Find parent company (the one with no parent_id)
    const parent = companies.find((c) => !c.parent_id);
    const branches = companies.filter((c) => !!c.parent_id);

    // 4. Build location string
    const buildLocation = (c: Record<string, unknown>) => {
      const parts: string[] = [];
      if (c.street && c.street !== false) parts.push(c.street as string);
      if (c.street2 && c.street2 !== false) parts.push(c.street2 as string);
      if (c.city && c.city !== false) parts.push(c.city as string);
      const country = Array.isArray(c.country_id) ? c.country_id[1] : null;
      if (country) parts.push(country as string);
      return parts.join(", ") || "Makkah, Saudi Arabia";
    };

    // 5. Map to our format
    const mapCompany = (c: Record<string, unknown>, isParent: boolean) => ({
      id: c.id as number,
      name: c.name as string,
      displayName: (c.display_name as string) || (c.name as string),
      arabicName: "",
      image: c.logo_web
        ? `data:image/png;base64,${c.logo_web}`
        : "/banner.jpg",
      location: buildLocation(c),
      address: [
        c.street && c.street !== false ? c.street : "",
        c.street2 && c.street2 !== false ? c.street2 : "",
      ]
        .filter(Boolean)
        .join(", "),
      city: (c.city as string) || "",
      state: Array.isArray(c.state_id) ? (c.state_id[1] as string) : "",
      country: Array.isArray(c.country_id)
        ? (c.country_id[1] as string)
        : "",
      zip: (c.zip as string) || "",
      phone: (c.phone as string) || "",
      mobile: (c.mobile as string) || "",
      email: (c.email as string) || "",
      website: (c.website as string) || "",
      currency: Array.isArray(c.currency_id)
        ? (c.currency_id[1] as string)
        : "SAR",
      parentId: Array.isArray(c.parent_id)
        ? (c.parent_id[0] as number)
        : null,
      isParent,
      childIds: (c.child_ids as number[]) || [],
      price: 0,
      rating: 0,
      reviews: 0,
      rooms: 0,
      propertyView: "noView",
      guestRating: "good",
      roomTypes: [] as string[],
    });

    const parentCompany = parent ? mapCompany(parent, true) : null;
    const hotelBranches = branches.map((b) => mapCompany(b, false));

    return NextResponse.json({
      source: "odoo",
      parentCompany,
      hotels: hotelBranches,
    });
  } catch (err) {
    console.error("Odoo API error:", err);
    return NextResponse.json({
      source: "error",
      parentCompany: null,
      hotels: [],
      error: String(err),
    });
  }
}
