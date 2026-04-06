// ═══════════════════════════════════════════════════════════════
// Admin Authentication
// Now uses real Odoo auth via /api/auth/signin
// Admin role verified via ADMIN_EMAILS env var or Odoo role
// ═══════════════════════════════════════════════════════════════

/**
 * Admin login via Odoo API.
 * Returns true on success, false on failure.
 */
export const adminLogin = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!json.ok) {
      return false;
    }

    // Mark admin session in localStorage for client-side guards
    localStorage.setItem("adminAuthenticated", "true");
    localStorage.setItem(
      "adminUser",
      JSON.stringify({
        name: json.data.name || "Admin",
        email: json.data.email || email,
        partner_id: json.data.partner_id,
      })
    );

    return true;
  } catch {
    return false;
  }
};

/**
 * Admin logout: clears cookies + localStorage.
 */
export const adminLogout = async () => {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
  } catch {
    // Ignore network errors
  }
  localStorage.removeItem("adminAuthenticated");
  localStorage.removeItem("adminUser");
};

/**
 * Check if admin is authenticated (client-side check).
 */
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("adminAuthenticated") === "true";
};

/**
 * Get current admin user info.
 */
export const getAdminUser = (): {
  name: string;
  email: string;
  partner_id?: number;
} | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("adminUser");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
