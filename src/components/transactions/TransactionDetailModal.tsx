"use client";

import { Modal } from "@/components/ui/Modal";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTransactionStore } from "@/store/transaction.store";
import { useAuthStore } from "@/store/auth.store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  const { updateStatus } = useTransactionStore();
  const { user } = useAuthStore();
  const canApprove = user?.role === "finance" && transaction?.status === "pending";

  if (!transaction) return null;

  return (
    <Modal
      isOpen={!!transaction}
      onClose={onClose}
      title={`Transaction: ${transaction.reference}`}
      description={`Created by ${transaction.createdBy} on ${formatDateTime(transaction.createdAt)}`}
      size="lg"
    >
      <div className="px-6 pb-6 space-y-5">
        {/* Status row */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          <StatusBadge status={transaction.status} />
          <Badge variant="neutral">
            <span className="capitalize">{transaction.type}</span>
          </Badge>
          {transaction.approvedBy && (
            <span className="text-xs text-slate-400">
              Processed by {transaction.approvedBy}
            </span>
          )}
        </div>

        {/* Line items */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Line Items
          </p>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Item</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Qty</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaction.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{item.itemName}</p>
                      <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                    Total Amount
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {transaction.notes && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Notes</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5">
              {transaction.notes}
            </p>
          </div>
        )}
      </div>

      {canApprove && (
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <Button
            variant="danger"
            size="sm"
            onClick={() => { updateStatus(transaction.id, "rejected", user?.name); onClose(); }}
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => { updateStatus(transaction.id, "approved", user?.name); onClose(); }}
          >
            Approve
          </Button>
        </div>
      )}
    </Modal>
  );
}
