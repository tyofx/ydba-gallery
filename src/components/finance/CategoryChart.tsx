"use client";

import { Card } from "@/components/ui/Card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CATEGORY_DISTRIBUTION } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";

const COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"];

export function CategoryChart() {
  const data = CATEGORY_DISTRIBUTION.filter((d) => d.value > 0);

  return (
    <Card>
      <p className="text-sm font-semibold text-slate-900 mb-1">Inventory by Category</p>
      <p className="text-xs text-slate-400 mb-4">Value distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(val: number) => [`IDR ${formatCompact(val)}`]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
