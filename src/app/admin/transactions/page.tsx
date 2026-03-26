"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { Button } from "@/components/ui/Button";
import { useTransactionStore } from "@/store/transaction.store";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";
import { Plus } from "lucide-react";

// 1. Import komponen ExportExcelButton
import { ExportExcelButton } from "@/components/ui/ExportButton";

export default function AdminTransactionsPage() {
  // 2. Ambil getFilteredTransactions dari store
  const { getFilteredTransactions } = useTransactionStore();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // 3. Gunakan data yang sudah difilter
  const filteredTransactions = getFilteredTransactions();

  // 4. Hitung ringkasan secara dinamis berdasarkan hasil filter
  const pending = filteredTransactions.filter(
    (t) => t.status === "pending",
  ).length;
  const totalVolume = filteredTransactions
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.totalAmount, 0);

  // 5. Format data untuk Excel agar nested object (items) menjadi string yang rapi
  const exportData = filteredTransactions.map((t) => ({
    "Reference ID": t.reference,
    "Tipe Transaksi": t.type.toUpperCase(),
    Status: t.status.toUpperCase(),
    "Total Nominal": t.totalAmount,
    "Dibuat Oleh": t.createdBy,
    "Disetujui Oleh": t.approvedBy || "-",
    Tanggal: new Date(t.createdAt).toLocaleString("id-ID"),
    // Menggabungkan nama barang dan kuantitasnya menjadi satu string
    "Rincian Barang": t.items
      .map((i) => `${i.itemName} (Qty: ${i.quantity})`)
      .join(", "),
    Catatan: t.notes || "-",
  }));

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Transactions
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredTransactions.length} total · {pending} pending ·{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(totalVolume)}
              </span>{" "}
              completed volume
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* 6. Pasang Tombol Export di sini */}
            <ExportExcelButton
              data={exportData}
              filename="Laporan_Transaksi_InvenFlow"
              sheetName="Riwayat Transaksi"
              label="Export"
              className="h-8 px-3 text-xs shadow-sm"
            />

            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              New Transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilters />

        {/* Table */}
        <TransactionTable onView={setSelectedTxn} />
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </DashboardLayout>
  );
}
