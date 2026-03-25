"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { CategoryChart } from "@/components/finance/CategoryChart";
import { Button } from "@/components/ui/Button";
import { useTransactionStore } from "@/store/transaction.store";
import { useInventoryStore } from "@/store/inventory.store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download, TrendingUp, TrendingDown, Package, BarChart3 } from "lucide-react";

export default function FinanceReportsPage() {
  const { transactions } = useTransactionStore();
  const { items } = useInventoryStore();

  const completed = transactions.filter((t) => t.status === "completed");
  const purchases = completed.filter((t) => t.type === "purchase");
  const sales = completed.filter((t) => t.type === "sale");

  const totalPurchases = purchases.reduce((s, t) => s + t.totalAmount, 0);
  const totalSales = sales.reduce((s, t) => s + t.totalAmount, 0);
  const inventoryValue = items.reduce((s, i) => s + i.totalValue, 0);
  const netFlow = totalSales - totalPurchases;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Reports
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Financial summary and analytics
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export PDF
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Purchases"
            value={formatCurrency(totalPurchases)}
            icon={<TrendingDown className="w-4 h-4" />}
            accent="danger"
          />
          <StatCard
            label="Total Sales"
            value={formatCurrency(totalSales)}
            icon={<TrendingUp className="w-4 h-4" />}
            accent="success"
          />
          <StatCard
            label="Net Cash Flow"
            value={formatCurrency(netFlow)}
            icon={<BarChart3 className="w-4 h-4" />}
            accent={netFlow >= 0 ? "success" : "danger"}
          />
          <StatCard
            label="Inventory Value"
            value={formatCurrency(inventoryValue)}
            icon={<Package className="w-4 h-4" />}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueChart />
          <CategoryChart />
        </div>

        {/* Transaction Summary Table */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">
              Completed Transactions Summary
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {completed.length} completed transactions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Reference", "Type", "Items", "Amount", "Date", "Approved By"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completed.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                      {txn.reference}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600">
                      {txn.type}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {txn.items[0]?.itemName}
                      {txn.items.length > 1 && (
                        <span className="text-slate-400">
                          {" "}
                          +{txn.items.length - 1}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">
                      {formatCurrency(txn.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDate(txn.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {txn.approvedBy ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right text-sm font-semibold text-slate-700"
                  >
                    Total
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {formatCurrency(
                      completed.reduce((s, t) => s + t.totalAmount, 0)
                    )}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
