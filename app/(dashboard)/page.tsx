"use client"

import {
  Users,
  TrendingUp,
  Coins,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useTrustStore } from "@/lib/store"
import { formatCurrency, formatPercentage, formatDate, getInitials } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { AssetChart } from "@/components/asset-chart"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  const { members, investments, getTrustOverview } = useTrustStore()
  const overview = getTrustOverview()

  const goldGrowth =
    investments
      .filter((i) => i.type === "gold")
      .reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) / i.purchasePrice) * 100, 0) /
    Math.max(investments.filter((i) => i.type === "gold").length, 1)

  const silverGrowth =
    investments
      .filter((i) => i.type === "silver")
      .reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) / i.purchasePrice) * 100, 0) /
    Math.max(investments.filter((i) => i.type === "silver").length, 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trust Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your Community Trust Bank dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Trust Assets"
          value={formatCurrency(overview.totalAssets)}
          change="+12.5% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-primary"
        />
        <StatCard
          title="Managing Directors"
          value={overview.totalMembers.toString()}
          change="All members are equal partners"
          changeType="neutral"
          icon={Users}
          iconColor="text-accent"
        />
        <StatCard
          title="Total Contributions"
          value={formatCurrency(overview.totalContributions)}
          change="+8.3% this month"
          changeType="positive"
          icon={PiggyBank}
          iconColor="text-success"
        />
        <StatCard
          title="Dividends Distributed"
          value={formatCurrency(overview.totalDividendsPaid)}
          change="Last payout: Jun 30"
          changeType="neutral"
          icon={Coins}
          iconColor="text-gold"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Asset Allocation
            </h2>
            <p className="text-sm text-muted-foreground">
              Portfolio breakdown by investment type
            </p>
            <div className="mt-6">
              <AssetChart />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Precious Metals
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/20 p-2">
                    <div className="h-full w-full rounded bg-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Gold Holdings</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(overview.goldValue)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formatPercentage(goldGrowth)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-silver/20 p-2">
                    <div className="h-full w-full rounded bg-silver" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Silver Holdings</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(overview.silverValue)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formatPercentage(silverGrowth)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Top Contributors
            </h2>
            <div className="mt-4 space-y-3">
              {[...members]
                .sort((a, b) => b.totalContributions - a.totalContributions)
                .slice(0, 4)
                .map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(member.totalContributions)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
