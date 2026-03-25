import { create } from "zustand";
import type { Transaction, TransactionFilters, TransactionStatus } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { generateReference } from "@/lib/utils";

interface TransactionState {
  transactions: Transaction[];
  filters: TransactionFilters;
  selectedTransaction: Transaction | null;

  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  selectTransaction: (txn: Transaction | null) => void;
  createTransaction: (txn: Omit<Transaction, "id" | "reference" | "createdAt" | "updatedAt" | "status">) => void;
  updateStatus: (id: string, status: TransactionStatus, approvedBy?: string) => void;
  getFilteredTransactions: () => Transaction[];
}

const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "all",
  status: "all",
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: MOCK_TRANSACTIONS,
  filters: DEFAULT_FILTERS,
  selectedTransaction: null,

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  selectTransaction: (txn) => set({ selectedTransaction: txn }),

  createTransaction: (data) => {
    const now = new Date().toISOString();
    const newTxn: Transaction = {
      ...data,
      id: `txn${Date.now()}`,
      reference: generateReference(data.type),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ transactions: [newTxn, ...state.transactions] }));
  },

  updateStatus: (id, status, approvedBy) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id
          ? { ...t, status, approvedBy, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  },

  getFilteredTransactions: () => {
    const { transactions, filters } = get();
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.createdBy.toLowerCase().includes(q) ||
          t.items.some((i) => i.itemName.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter((t) => t.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      result = result.filter((t) => t.createdAt <= filters.dateTo!);
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
}));
