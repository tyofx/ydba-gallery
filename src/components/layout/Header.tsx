"use client";

import { useAuthStore } from "@/store/auth.store";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/inventory": "Inventory",
  "/admin/transactions": "Transactions",
  "/finance/dashboard": "Dashboard",
  "/finance/transactions": "Transactions",
  "/finance/reports": "Reports",
};

export function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const title =
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "Overview";

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
      <h1 className="text-sm font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-700">
            {user?.name?.charAt(0) ?? "?"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
