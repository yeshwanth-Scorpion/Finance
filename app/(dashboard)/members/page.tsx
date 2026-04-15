"use client"

import { useState } from "react"
import { Plus, Search, Shield, Mail, Phone, Calendar } from "lucide-react"
import { useTrustStore } from "@/lib/store"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { AddMemberModal } from "@/components/add-member-modal"

export default function MembersPage() {
  const { members } = useTrustStore()
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Managing Directors
          </h1>
          <p className="text-muted-foreground">
            All members have equal ownership and voting rights in the trust
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-sm text-muted-foreground">
            Total Members:{" "}
            <span className="font-semibold text-foreground">
              {members.length}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                  {getInitials(member.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gold">
                    <Shield className="h-3 w-3" />
                    {member.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {member.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(member.joinedAt)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Contributed</p>
                <p className="text-lg font-semibold text-success">
                  {formatCurrency(member.totalContributions)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dividends</p>
                <p className="text-lg font-semibold text-gold">
                  {formatCurrency(member.totalDividends)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
