"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Coins,
  PiggyBank,
  Wallet,
  Settings,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "Contributions", href: "/contributions", icon: PiggyBank },
  { name: "Dividends", href: "/dividends", icon: Coins },
  { name: "My Account", href: "/account", icon: Wallet },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">Community Trust</h1>
          <p className="text-xs text-muted-foreground">Bank</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-gold">
            <Coins className="h-4 w-4" />
            <span className="text-xs font-semibold">Trust Assets</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            All members are Managing Directors with equal voting rights.
          </p>
        </div>
      </div>
    </aside>
  )
}
