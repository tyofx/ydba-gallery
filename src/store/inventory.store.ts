import { create } from "zustand";
import type { InventoryItem, InventoryFilters } from "@/types";
import { MOCK_INVENTORY } from "@/lib/mock-data";

interface InventoryState {
  items: InventoryItem[];
  filters: InventoryFilters;
  selectedItem: InventoryItem | null;
  isLoading: boolean;

  setFilters: (filters: Partial<InventoryFilters>) => void;
  resetFilters: () => void;
  selectItem: (item: InventoryItem | null) => void;
  addItem: (item: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated" | "totalValue" | "status">) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getFilteredItems: () => InventoryItem[];
}

const DEFAULT_FILTERS: InventoryFilters = {
  search: "",
  category: "all",
  status: "all",
  sortBy: "name",
  sortOrder: "asc",
};

function computeStatus(quantity: number, minQuantity: number): InventoryItem["status"] {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= minQuantity) return "low_stock";
  return "in_stock";
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: MOCK_INVENTORY,
  filters: DEFAULT_FILTERS,
  selectedItem: null,
  isLoading: false,

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  selectItem: (item) => set({ selectedItem: item }),

  addItem: (itemData) => {
    const now = new Date().toISOString().split("T")[0];
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv${Date.now()}`,
      totalValue: itemData.quantity * itemData.unitPrice,
      status: computeStatus(itemData.quantity, itemData.minQuantity),
      createdAt: now,
      lastUpdated: now,
    };
    set((state) => ({ items: [...state.items, newItem] }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates, lastUpdated: new Date().toISOString().split("T")[0] };
        updated.totalValue = updated.quantity * updated.unitPrice;
        updated.status = computeStatus(updated.quantity, updated.minQuantity);
        return updated;
      }),
    }));
  },

  deleteItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  getFilteredItems: () => {
    const { items, filters } = get();
    let result = [...items];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.supplier?.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((i) => i.category === filters.category);
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((i) => i.status === filters.status);
    }

    if (filters.sortBy) {
      result.sort((a, b) => {
        const aVal = a[filters.sortBy!];
        const bVal = b[filters.sortBy!];
        const order = filters.sortOrder === "desc" ? -1 : 1;
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * order;
        }
        return ((aVal as number) - (bVal as number)) * order;
      });
    }

    return result;
  },
}));
