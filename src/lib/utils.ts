import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

// ─── Class Name Utility ───────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatting ──────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency = "IDR",
  locale = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatCompact(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy • HH:mm");
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// ─── Status Utilities ─────────────────────────────────────────────────────────

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: "text-emerald-700 bg-emerald-50 border-emerald-200",
    low_stock: "text-amber-700 bg-amber-50 border-amber-200",
    out_of_stock: "text-red-700 bg-red-50 border-red-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    approved: "text-blue-700 bg-blue-50 border-blue-200",
    completed: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rejected: "text-red-700 bg-red-50 border-red-200",
  };
  return colors[status] ?? "text-slate-700 bg-slate-50 border-slate-200";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    pending: "Pending",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
    purchase: "Purchase",
    sale: "Sale",
    adjustment: "Adjustment",
    transfer: "Transfer",
    return: "Return",
  };
  return labels[status] ?? status;
}

// ─── Change Indicator ─────────────────────────────────────────────────────────

export function formatChange(value: number): {
  label: string;
  positive: boolean;
} {
  const positive = value >= 0;
  return {
    label: `${positive ? "+" : ""}${value.toFixed(1)}%`,
    positive,
  };
}

// ─── SKU Generator ────────────────────────────────────────────────────────────

export function generateSku(category: string, id: string): string {
  const prefix = category.slice(0, 3).toUpperCase();
  return `${prefix}-${id.slice(-6).toUpperCase()}`;
}

// ─── Reference Generator ──────────────────────────────────────────────────────

export function generateReference(type: string): string {
  const prefix = type.slice(0, 2).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
}
