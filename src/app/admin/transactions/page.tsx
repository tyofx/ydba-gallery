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
import { Plus, Download } from "lucide-react";

export default function AdminTransactionsPage() {
  const { transactions } = useTransactionStore();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const pending = transactions.filter((t) => t.status === "pending").length;
  const totalVolume = transactions
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.totalAmount, 0);

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
              {transactions.length} total · {pending} pending ·{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(totalVolume)}
              </span>{" "}
              completed volume
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
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
