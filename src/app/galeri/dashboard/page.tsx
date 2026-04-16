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

// 1. Import komponen dari recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const { items } = useInventoryStore();
  const { transactions } = useTransactionStore();

  // --- STATS DATA ---
  const totalValue = items.reduce((s, i) => s + i.totalValue, 0);
  const lowStock = items.filter((i) => i.status === "low_stock").length;
  const outOfStock = items.filter((i) => i.status === "out_of_stock").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const topItems = [...items]
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // A. Top 5 Customer (Berdasarkan Frekuensi Beli di Transaksi Penjualan)
  const customerSales = transactions
    .filter((t) => t.type === "sale")
    .reduce(
      (acc, t) => {
        // Menggunakan createdBy sebagai perwakilan nama customer/user
        const customer = t.createdBy || "Unknown";
        acc[customer] = (acc[customer] || 0) + 1; // Menghitung frekuensi pesanan
        return acc;
      },
      {} as Record<string, number>,
    );

  const topCustomersData = Object.entries(customerSales)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // B. Top 5 Barang Terjual (Berdasarkan total kuantitas di Transaksi Penjualan)
  const itemSales = transactions
    .filter((t) => t.type === "sale")
    .reduce(
      (acc, t) => {
        t.items.forEach((item) => {
          acc[item.itemName] = (acc[item.itemName] || 0) + item.quantity; // Menjumlahkan kuantitas
        });
        return acc;
      },
      {} as Record<string, number>,
    );

  const topSoldItemsData = Object.entries(itemSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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

        {/* ============================== */}
        {/* NEW SECTION: CHARTS */}
        {/* ============================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Top Customers */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-6">
              Top 5 Customers (Frekuensi Order)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCustomersData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Total Order"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top Sold Items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-6">
              Top 5 Barang/UMKM Terjual (Kuantitas)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSoldItemsData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  {/* Warna bar biru yang cerah untuk pembeda */}
                  <Bar
                    dataKey="quantity"
                    name="Kuantitas Terjual"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* ============================== */}

        {/* Two column section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Recent Transactions */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">
                Recent Transactions
              </p>
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
              <p className="text-sm font-semibold text-slate-900">
                Top Items by Value
              </p>
              <Link
                href="/admin/inventory"
                className="text-xs text-slate-400 hover:text-slate-900 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {topItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="text-xs font-semibold text-slate-300 w-4 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
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
