"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  roles?: ("admin" | "finance")[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ["admin"],
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: <Package className="w-4 h-4" />,
    roles: ["admin"],
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: <ArrowLeftRight className="w-4 h-4" />,
    roles: ["admin"],
  },
  {
    label: "Dashboard",
    href: "/finance/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ["finance"],
  },
  {
    label: "Transactions",
    href: "/finance/transactions",
    icon: <ArrowLeftRight className="w-4 h-4" />,
    roles: ["finance"],
  },
  {
    label: "Reports",
    href: "/finance/reports",
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ["finance"],
  },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-14 px-4 border-b border-slate-100 shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              InvenFlow
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Role badge */}
      {!collapsed && user && (
        <div className="px-3 pt-4 pb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {user.role === "admin" ? "Administration" : "Finance"}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                collapsed && "justify-center px-2"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-slate-100 space-y-0.5">
        {!collapsed && user && (
          <div className="px-2.5 py-2 mb-1">
            <p className="text-xs font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
