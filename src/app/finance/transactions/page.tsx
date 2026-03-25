"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { useTransactionStore } from "@/store/transaction.store";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

export default function FinanceTransactionsPage() {
  const { transactions } = useTransactionStore();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const pending = transactions.filter((t) => t.status === "pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Transactions
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {transactions.length} total ·{" "}
              {pending > 0 && (
                <span className="font-medium text-amber-600">
                  {pending} pending approval
                </span>
              )}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
        </div>

        <TransactionFilters />
        <TransactionTable onView={setSelectedTxn} showActions />
      </div>

      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </DashboardLayout>
  );
}
