"use client";

import AdminAuthGuard from "./_components/AdminAuthGuard";
import AdminSidebar from "./_components/AdminSidebar";
import AdminTopBar from "./_components/AdminTopBar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthGuard>
      {isLoginPage ? (
        children
      ) : (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopBar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
