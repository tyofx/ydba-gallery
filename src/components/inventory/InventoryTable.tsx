"use client";

import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useInventoryStore } from "@/store/inventory.store";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import type { InventoryItem } from "@/types";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";

interface InventoryTableProps {
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  readOnly?: boolean;
}

export function InventoryTable({ onEdit, onDelete, readOnly }: InventoryTableProps) {
  const { getFilteredItems, filters, setFilters } = useInventoryStore();
  const items = getFilteredItems();

  const handleSort = (key: string) => {
    if (filters.sortBy === key) {
      setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortBy: key as keyof InventoryItem, sortOrder: "asc" });
    }
  };

  const columns = [
    {
      key: "sku",
      label: "SKU",
      className: "font-mono text-xs text-slate-500 w-32",
    },
    {
      key: "name",
      label: "Item Name",
      sortable: true,
      render: (_: unknown, row: InventoryItem) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          {row.supplier && (
            <p className="text-xs text-slate-400">{row.supplier}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (val: unknown) => (
        <span className="capitalize text-slate-600">
          {String(val).replace("_", " ")}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      sortable: true,
      className: "text-right",
      render: (val: unknown, row: InventoryItem) => (
        <span
          className={
            row.status === "low_stock"
              ? "text-amber-600 font-semibold"
              : row.status === "out_of_stock"
              ? "text-red-600 font-semibold"
              : "text-slate-900"
          }
        >
          {formatNumber(Number(val))}
        </span>
      ),
    },
    {
      key: "unitPrice",
      label: "Unit Price",
      sortable: true,
      className: "text-right",
      render: (val: unknown) => (
        <span className="font-mono text-sm">{formatCurrency(Number(val))}</span>
      ),
    },
    {
      key: "totalValue",
      label: "Total Value",
      sortable: true,
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
      key: "lastUpdated",
      label: "Updated",
      render: (val: unknown) => (
        <span className="text-slate-400 text-xs">{formatDate(String(val))}</span>
      ),
    },
    ...(!readOnly
      ? [
          {
            key: "actions",
            label: "",
            className: "w-20",
            render: (_: unknown, row: InventoryItem) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(row);
                  }}
                  className="h-7 w-7 p-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(row);
                  }}
                  className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns as never}
      data={items}
      keyField="id"
      sortBy={filters.sortBy as string}
      sortOrder={filters.sortOrder}
      onSort={handleSort}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-4">
          <AlertTriangle className="w-8 h-8 text-slate-300" />
          <p className="text-sm text-slate-400">No inventory items found</p>
        </div>
      }
    />
  );
}
