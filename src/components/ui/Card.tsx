import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-card",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; label?: string };
  icon?: React.ReactNode;
  className?: string;
  accent?: "default" | "warning" | "danger" | "success";
}

const accentMap = {
  default: "bg-slate-50 text-slate-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  success: "bg-emerald-50 text-emerald-600",
};

export function StatCard({
  label,
  value,
  change,
  icon,
  className,
  accent = "default",
}: StatCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        {icon && (
          <div className={cn("p-2 rounded-lg", accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900 tracking-tight">
          {value}
        </p>
        {change && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              isPositive ? "text-emerald-600" : "text-red-600"
            )}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change.value)}%{" "}
            <span className="text-slate-400 font-normal">
              {change.label ?? "vs last month"}
            </span>
          </p>
        )}
      </div>
    </Card>
  );
}
