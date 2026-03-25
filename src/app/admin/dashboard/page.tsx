"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { useInventoryStore } from "@/store/inventory.store";
import { useTransactionStore } from "@/store/transaction.store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Clock,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { items } = useInventoryStore();
  const { transactions } = useTransactionStore();

  const totalValue = items.reduce((s, i) => s + i.totalValue, 0);
  const lowStock = items.filter((i) => i.status === "low_stock").length;
  const outOfStock = items.filter((i) => i.status === "out_of_stock").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const recent = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const topItems = [...items].sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Items"
            value={items.length}
            icon={<Package className="w-4 h-4" />}
          />
          <StatCard
            label="Inventory Value"
            value={formatCurrency(totalValue)}
            icon={<DollarSign className="w-4 h-4" />}
            change={{ value: 5.2 }}
          />
          <StatCard
            label="Low Stock Alerts"
            value={lowStock}
            icon={<AlertTriangle className="w-4 h-4" />}
            accent={lowStock > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Pending Approvals"
            value={pending}
            icon={<Clock className="w-4 h-4" />}
            accent={pending > 0 ? "warning" : "default"}
          />
        </div>

        {/* Two column section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Recent Transactions */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Recent Transactions</p>
              <Link
                href="/admin/transactions"
                className="text-xs text-slate-400 hover:text-slate-900 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recent.map((txn) => (
                <div key={txn.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 font-mono">
                      {txn.reference}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {txn.items[0]?.itemName}
                      {txn.items.length > 1 && ` +${txn.items.length - 1}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(txn.totalAmount)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDateTime(txn.createdAt).split("•")[0].trim()}
                    </p>
                  </div>
                  <StatusBadge status={txn.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Top Items by Value */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Top Items by Value</p>
              <Link
                href="/admin/inventory"
                className="text-xs text-slate-400 hover:text-slate-900 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {topItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs font-semibold text-slate-300 w-4 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-900">
                      {formatCurrency(item.totalValue)}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Out of stock alert */}
        {outOfStock > 0 && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {outOfStock} item{outOfStock > 1 ? "s are" : " is"} out of stock
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Create purchase orders to restock.{" "}
                <Link href="/admin/inventory" className="underline">
                  View inventory →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
