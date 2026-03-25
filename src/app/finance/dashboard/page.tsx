"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/Card";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { CategoryChart } from "@/components/finance/CategoryChart";
import { useTransactionStore } from "@/store/transaction.store";
import { useInventoryStore } from "@/store/inventory.store";
import { formatCurrency } from "@/lib/utils";
import { MOCK_FINANCE_SUMMARY } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default function FinanceDashboardPage() {
  const { transactions } = useTransactionStore();
  const { items } = useInventoryStore();
  const summary = MOCK_FINANCE_SUMMARY;

  const inventoryValue = items.reduce((s, i) => s + i.totalValue, 0);
  const pending = transactions.filter((t) => t.status === "pending");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(summary.totalRevenue)}
            change={{ value: summary.revenueChange }}
            icon={<TrendingUp className="w-4 h-4" />}
            accent="success"
          />
          <StatCard
            label="Total Expenses"
            value={formatCurrency(summary.totalExpenses)}
            change={{ value: summary.expensesChange }}
            icon={<TrendingDown className="w-4 h-4" />}
            accent="danger"
          />
          <StatCard
            label="Inventory Value"
            value={formatCurrency(inventoryValue)}
            icon={<Package className="w-4 h-4" />}
          />
          <StatCard
            label="Pending Approvals"
            value={pending.length}
            icon={<Clock className="w-4 h-4" />}
            accent={pending.length > 0 ? "warning" : "default"}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueChart />
          <CategoryChart />
        </div>

        {/* Pending Approvals */}
        {pending.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">
                Awaiting Your Approval
              </p>
              <Link
                href="/finance/transactions"
                className="text-xs text-slate-400 hover:text-slate-900 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {pending.map((txn) => (
                <div key={txn.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-semibold text-slate-900">
                      {txn.reference}
                    </p>
                    <p className="text-xs text-slate-400">
                      {txn.items[0]?.itemName}
                      {txn.items.length > 1 && ` +${txn.items.length - 1} more`}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 font-mono">
                    {formatCurrency(txn.totalAmount)}
                  </p>
                  <StatusBadge status={txn.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
