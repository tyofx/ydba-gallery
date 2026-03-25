// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "finance";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export type ItemStatus = "in_stock" | "low_stock" | "out_of_stock";
export type ItemCategory =
  | "electronics"
  | "office_supplies"
  | "furniture"
  | "consumables"
  | "equipment"
  | "other";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: ItemCategory;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  totalValue: number;
  status: ItemStatus;
  supplier?: string;
  location?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface InventoryFilters {
  search?: string;
  category?: ItemCategory | "all";
  status?: ItemStatus | "all";
  sortBy?: keyof InventoryItem;
  sortOrder?: "asc" | "desc";
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TransactionType = "purchase" | "sale" | "adjustment" | "transfer" | "return";
export type TransactionStatus = "pending" | "approved" | "rejected" | "completed";

export interface TransactionLineItem {
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  status: TransactionStatus;
  items: TransactionLineItem[];
  totalAmount: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  status?: TransactionStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}

// ─── Finance ─────────────────────────────────────────────────────────────────

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  inventoryValue: number;
  pendingApprovals: number;
  revenueChange: number;
  expensesChange: number;
  profitChange: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
  pendingTransactions: number;
  completedToday: number;
  recentTransactions: Transaction[];
  topItems: InventoryItem[];
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
