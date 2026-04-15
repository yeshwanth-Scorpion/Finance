"use client"

import { Bell, Search, ChevronDown } from "lucide-react"
import { useTrustStore } from "@/lib/store"
import { getInitials } from "@/lib/utils"

export function Header() {
  const { members, currentMemberId, setCurrentMember } = useTrustStore()
  const currentMember = members.find((m) => m.id === currentMemberId)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="relative">
          <button className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-3 py-2 hover:bg-secondary/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {currentMember ? getInitials(currentMember.name) : "?"}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">
                {currentMember?.name || "Select Member"}
              </p>
              <p className="text-xs text-muted-foreground">Managing Director</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
