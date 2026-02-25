"use client";

import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { adminLogout, getAdminUser } from "../_lib/adminAuth";

export default function AdminTopBar() {
  const router = useRouter();
  const user = getAdminUser();

  const handleLogout = () => {
    adminLogout();
    router.replace("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="lg:hidden w-10" /> {/* Spacer for mobile hamburger */}
      <h1 className="text-lg font-semibold text-gray-800 hidden lg:block">
        Hotel Management
      </h1>

      <div className="flex items-center gap-4">
        {/* Admin avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1F8593] flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">
            {user?.name || "Admin"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <FaSignOutAlt size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
