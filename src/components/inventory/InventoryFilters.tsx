"use client";

import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useInventoryStore } from "@/store/inventory.store";
import { Search, SlidersHorizontal, X } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "furniture", label: "Furniture" },
  { value: "consumables", label: "Consumables" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export function InventoryFilters() {
  const { filters, setFilters, resetFilters } = useInventoryStore();
  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-1 min-w-[200px] max-w-xs">
        <Input
          placeholder="Search by name, SKU…"
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value })}
          leftIcon={<Search className="w-3.5 h-3.5" />}
        />
      </div>
      <div className="w-44">
        <Select
          options={CATEGORY_OPTIONS}
          value={filters.category ?? "all"}
          onChange={(e) =>
            setFilters({ category: e.target.value as typeof filters.category })
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
      {hasActiveFilters && (
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
