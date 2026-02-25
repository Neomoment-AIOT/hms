"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "./_lib/adminAuth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return null;
}
