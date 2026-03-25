"use client";

import { Card } from "@/components/ui/Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MONTHLY_REVENUE } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";

export function RevenueChart() {
  const data = MONTHLY_REVENUE.map((d) => ({
    month: d.label,
    Revenue: d.value,
    Expenses: d.secondaryValue,
  }));

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Revenue vs Expenses</p>
          <p className="text-xs text-slate-400">Last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-900 rounded-full inline-block" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 bg-slate-300 rounded-full inline-block" />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompact(v)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(val: number) => [
              `IDR ${formatCompact(val)}`,
            ]}
          />
          <Area
            type="monotone"
            dataKey="Revenue"
            stroke="#0f172a"
            strokeWidth={2}
            fill="url(#revGrad)"
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#94a3b8"
            strokeWidth={2}
            fill="url(#expGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
