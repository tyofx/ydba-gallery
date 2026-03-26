"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { useTransactionStore } from "@/store/transaction.store";
import type { Transaction } from "@/types";

// 1. Import komponen ExportExcelButton
import { ExportExcelButton } from "@/components/ui/ExportButton";

export default function FinanceTransactionsPage() {
  // 2. Ambil getFilteredTransactions dari store (bukan mengambil seluruh 'transactions')
  const { getFilteredTransactions } = useTransactionStore();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // 3. Simpan data hasil filter
  const filteredTransactions = getFilteredTransactions();

  // 4. Hitung jumlah pending berdasarkan data yang difilter
  const pending = filteredTransactions.filter(
    (t) => t.status === "pending",
  ).length;

  // 5. Format data untuk diekspor ke Excel (agar rincian barang menjadi string yang rapi)
  const exportData = filteredTransactions.map((t) => ({
    "Reference ID": t.reference,
    "Tipe Transaksi": t.type.toUpperCase(),
    Status: t.status.toUpperCase(),
    "Total Nominal": t.totalAmount,
    "Dibuat Oleh": t.createdBy,
    "Disetujui Oleh": t.approvedBy || "-",
    Tanggal: new Date(t.createdAt).toLocaleString("id-ID"),
    "Rincian Barang": t.items
      .map((i) => `${i.itemName} (Qty: ${i.quantity})`)
      .join(", "),
    Catatan: t.notes || "-",
  }));

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Transactions
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredTransactions.length} total ·{" "}
              {pending > 0 && (
                <span className="font-medium text-amber-600">
                  {pending} pending approval
                </span>
              )}
            </p>
          </div>

          {/* 6. Gunakan komponen ExportExcelButton di sini */}
          <ExportExcelButton
            data={exportData}
            filename="Laporan_Persetujuan_Transaksi_InvenFlow"
            sheetName="Daftar Transaksi"
            label="Export"
            className="h-8 px-3 text-xs shadow-sm"
          />
        </div>

        <TransactionFilters />

        {/* showActions = true di sini berfungsi untuk menampilkan tombol approve/reject bagi finance */}
        <TransactionTable onView={setSelectedTxn} showActions />
      </div>

      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </DashboardLayout>
  );
}
