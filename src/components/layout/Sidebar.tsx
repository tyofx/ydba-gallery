"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Database,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  roles?: ("admin" | "finance")[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Master Data",
    items: [
      {
        label: "Master Barang",
        href: "/admin/master-barang",
        icon: <Package className="w-4 h-4" />,
        roles: ["admin"],
      },
      {
        label: "Master Customer Information File",
        href: "/admin/master-cif",
        icon: <Users className="w-4 h-4" />,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        label: "Transaksi Pembelian Stok",
        href: "/admin/transaksi/pembelian",
        icon: <Database className="w-4 h-4" />,
        roles: ["admin", "finance"],
      },
      {
        label: "Transaksi Penjualan Barang",
        href: "/admin/transaksi/penjualan",
        icon: <ShoppingCart className="w-4 h-4" />,
        roles: ["admin", "finance"],
      },
    ],
  },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // State untuk menyimpan grup mana yang terbuka
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Master Data",
    "Transaksi",
  ]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center h-14 px-4 border-b border-slate-100 shrink-0",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-slate-900 text-sm tracking-tight">
              InvenFlow
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {/* Dashboard Tetap Statis di Atas */}
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all",
            pathname === "/admin/dashboard"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100",
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Dropdown Groups */}
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || (user && item.roles.includes(user.role)),
          );
          if (visibleItems.length === 0) return null;

          const isOpen = openGroups.includes(group.title);

          return (
            <div key={group.title} className="space-y-1">
              {/* Header Grup (Tombol Dropdown) */}
              {!collapsed ? (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {group.title}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform",
                      isOpen ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
              ) : (
                <div className="border-t border-slate-100 my-2 mx-2" />
              )}

              {/* Items (Hanya muncul jika isOpen atau jika sidebar dikecilkan) */}
              {(isOpen || collapsed) && (
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all",
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100",
                          collapsed && "justify-center",
                        )}
                      >
                        <div className="shrink-0">{item.icon}</div>
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="px-2 py-3 border-t border-slate-100 shrink-0">
        {!collapsed && user && (
          <div className="px-2.5 py-2 mb-1">
            <p className="text-xs font-medium text-slate-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
