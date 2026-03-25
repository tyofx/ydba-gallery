import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
}

const variantClasses = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-slate-50 text-slate-500 border-slate-200",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeProps["variant"]> = {
    in_stock: "success",
    low_stock: "warning",
    out_of_stock: "danger",
    pending: "warning",
    approved: "info",
    completed: "success",
    rejected: "danger",
  };

  const labelMap: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
    pending: "Pending",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
  };

  return (
    <Badge variant={variantMap[status] ?? "neutral"}>
      {labelMap[status] ?? status}
    </Badge>
  );
}
