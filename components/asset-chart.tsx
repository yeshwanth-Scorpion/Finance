"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { useTrustStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

const COLORS = {
  gold: "#d4af37",
  silver: "#c0c0c0",
  stocks: "#22c55e",
  bonds: "#3b82f6",
  real_estate: "#8b5cf6",
  other: "#64748b",
}

const TYPE_LABELS = {
  gold: "Gold",
  silver: "Silver",
  stocks: "Stocks",
  bonds: "Bonds",
  real_estate: "Real Estate",
  other: "Other",
}

export function AssetChart() {
  const { investments } = useTrustStore()

  const data = Object.entries(
    investments.reduce((acc, inv) => {
      const value = inv.currentPrice * inv.quantity
      acc[inv.type] = (acc[inv.type] || 0) + value
      return acc
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    name: TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type,
    value,
    color: COLORS[type as keyof typeof COLORS] || COLORS.other,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row">
      <div className="h-64 w-full lg:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                      <p className="font-medium text-foreground">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(data.value)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {((data.value / total) * 100).toFixed(1)}%
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid w-full gap-2 lg:w-1/2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(item.value)}
              </p>
              <p className="text-xs text-muted-foreground">
                {((item.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
