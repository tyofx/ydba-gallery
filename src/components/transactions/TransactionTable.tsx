"use client";

import { Table } from "@/components/ui/Table";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTransactionStore } from "@/store/transaction.store";
import { useAuthStore } from "@/store/auth.store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Transaction } from "@/types";
import { Eye, CheckCircle, XCircle } from "lucide-react";

interface TransactionTableProps {
  onView?: (txn: Transaction) => void;
  showActions?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  purchase: "info",
  sale: "success",
  adjustment: "warning",
  transfer: "neutral",
  return: "default",
};

export function TransactionTable({ onView, showActions = true }: TransactionTableProps) {
  const { getFilteredTransactions, updateStatus } = useTransactionStore();
  const { user } = useAuthStore();
  const transactions = getFilteredTransactions();

  const canApprove = user?.role === "finance";

  const columns = [
    {
      key: "reference",
      label: "Reference",
      render: (_: unknown, row: Transaction) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.reference}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (val: unknown) => (
        <Badge variant={TYPE_COLORS[String(val)] as never}>
          <span className="capitalize">{String(val)}</span>
        </Badge>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (_: unknown, row: Transaction) => (
        <div>
          <p className="text-slate-900 text-sm">
            {row.items[0]?.itemName}
            {row.items.length > 1 && (
              <span className="text-slate-400 ml-1">
                +{row.items.length - 1} more
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">
            {row.items.reduce((s, i) => s + i.quantity, 0)} units
          </p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      className: "text-right",
      render: (val: unknown) => (
        <span className="font-mono text-sm font-medium">
          {formatCurrency(Number(val))}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: unknown) => <StatusBadge status={String(val)} />,
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (val: unknown) => (
        <span className="text-slate-500 text-xs">{String(val)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val: unknown) => (
        <span className="text-slate-400 text-xs">{formatDateTime(String(val))}</span>
      ),
    },
    ...(showActions
      ? [
          {
            key: "actions",
            label: "",
            className: "w-28",
            render: (_: unknown, row: Transaction) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onView?.(row); }}
                  className="h-7 w-7 p-0"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                {canApprove && row.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(row.id, "approved", user?.name);
                      }}
                      className="h-7 w-7 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                      title="Approve"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(row.id, "rejected", user?.name);
                      }}
                      className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                      title="Reject"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns as never}
      data={transactions}
      keyField="id"
      onRowClick={onView}
      emptyState={
        <p className="text-sm text-slate-400 py-4">No transactions found</p>
      }
    />
  );
}
