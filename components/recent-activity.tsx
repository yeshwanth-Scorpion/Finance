"use client"

import { PiggyBank, Coins, TrendingUp, UserPlus } from "lucide-react"
import { useTrustStore } from "@/lib/store"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function RecentActivity() {
  const { members, contributions, dividends } = useTrustStore()

  const activities = [
    ...contributions.map((c) => ({
      id: c.id,
      type: "contribution" as const,
      memberId: c.memberId,
      amount: c.amount,
      date: c.date,
      description: `${c.type === "monthly" ? "Monthly" : c.type === "bonus" ? "Bonus" : "One-time"} contribution`,
    })),
    ...dividends.map((d) => ({
      id: d.id,
      type: "dividend" as const,
      memberId: d.memberId,
      amount: d.amount,
      date: d.date,
      description: d.source,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const getMember = (memberId: string) =>
    members.find((m) => m.id === memberId)

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
      <p className="text-sm text-muted-foreground">
        Latest contributions and dividend distributions
      </p>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => {
          const member = getMember(activity.memberId)
          const isContribution = activity.type === "contribution"

          return (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isContribution ? "bg-success/20" : "bg-gold/20"
                  )}
                >
                  {isContribution ? (
                    <PiggyBank
                      className={cn("h-5 w-5", "text-success")}
                    />
                  ) : (
                    <Coins className="h-5 w-5 text-gold" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {member?.name || "Unknown Member"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold",
                    isContribution ? "text-success" : "text-gold"
                  )}
                >
                  {isContribution ? "+" : ""}
                  {formatCurrency(activity.amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
