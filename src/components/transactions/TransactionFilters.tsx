"use client";

import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTransactionStore } from "@/store/transaction.store";
import { Search, X } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" },
  { value: "adjustment", label: "Adjustment" },
  { value: "transfer", label: "Transfer" },
  { value: "return", label: "Return" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export function TransactionFilters() {
  const { filters, setFilters, resetFilters } = useTransactionStore();
  const hasActive =
    filters.search || filters.type !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-1 min-w-[200px] max-w-xs">
        <Input
          placeholder="Search reference, item…"
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value })}
          leftIcon={<Search className="w-3.5 h-3.5" />}
        />
      </div>
      <div className="w-40">
        <Select
          options={TYPE_OPTIONS}
          value={filters.type ?? "all"}
          onChange={(e) =>
            setFilters({ type: e.target.value as typeof filters.type })
          }
        />
      </div>
      <div className="w-40">
        <Select
          options={STATUS_OPTIONS}
          value={filters.status ?? "all"}
          onChange={(e) =>
            setFilters({ status: e.target.value as typeof filters.status })
          }
        />
      </div>
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          leftIcon={<X className="w-3.5 h-3.5" />}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
