"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated } from "../_lib/adminAuth";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthed(auth);
    setChecked(true);

    if (!auth && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [pathname, isLoginPage, router]);

  // Still checking auth state
  if (!checked) return null;

  // On login page, render children without any wrapper
  if (isLoginPage) return <>{children}</>;

  // Not authenticated and not on login page — redirecting
  if (!authed) return null;

  // Authenticated — render children (layout wraps with sidebar/topbar)
  return <>{children}</>;
}
