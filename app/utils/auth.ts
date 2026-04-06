// ═══════════════════════════════════════════════════════════════
// Client-side Auth Utilities
// Calls Next.js BFF auth routes (which proxy to Odoo)
// ═══════════════════════════════════════════════════════════════

export type User = {
  partner_id: number;
  name: string;
  email: string;
};

// ─── Sign In ───────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!json.ok) {
      return { ok: false, error: json.error || "Invalid credentials" };
    }

    const user: User = {
      partner_id: json.data.partner_id,
      name: json.data.name || email.split("@")[0],
      email: json.data.email || email,
    };

    // Store minimal user info for client-side display
    // (auth itself is in HTTP-only cookies, not here)
    localStorage.setItem("user", JSON.stringify(user));

    return { ok: true, user };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ─── Sign Up ───────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  name?: string,
  mobile?: string
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, mobile }),
    });

    const json = await res.json();

    if (!json.ok) {
      return { ok: false, error: json.error || "Signup failed" };
    }

    return { ok: true, message: json.data.message || "Signup successful" };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ─── Forgot Password ──────────────────────────────────────────

export async function forgotPassword(
  email: string
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();

    if (!json.ok) {
      return { ok: false, error: json.error || "Failed to reset password" };
    }

    return { ok: true, message: json.data.message };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ─── Change Password ──────────────────────────────────────────

export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      return { ok: false, error: json.error || "Failed to change password" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ─── Sign Out ─────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
  } catch {
    // Ignore network errors on signout
  }
  localStorage.removeItem("user");
}

// ─── Get Current User (from localStorage cache) ──────────────

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ─── Fetch fresh user profile from server ─────────────────────

export async function fetchUserProfile(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/me");
    const json = await res.json();

    if (!json.ok || !json.data) return null;

    const user: User = {
      partner_id: json.data.partner_id,
      name: json.data.name || json.data.complete_name || "",
      email: json.data.email || "",
    };

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

// ─── Backward-compatible aliases ──────────────────────────────
// These keep existing components working during migration.
// Remove once all components are updated.

/** @deprecated Use signIn() instead */
export const loginFake = (email: string, password: string) => {
  // Synchronous fallback for components not yet migrated
  if (email === "admin@gmail.com" && password === "admin") {
    const user = { partner_id: 0, name: "Admin User", email };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
};

/** @deprecated Use signOut() instead */
export const logoutFake = () => {
  localStorage.removeItem("user");
};
