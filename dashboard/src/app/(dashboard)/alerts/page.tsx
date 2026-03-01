"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  BellRinging,
  CheckCircle,
  Warning,
  ShieldCheck,
  ChartLineUp,
  Wallet,
  Checks,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Notification {
  id: string
  type: "score_change" | "budget_alert" | "verification" | "system"
  title: string
  message: string
  agentAddress?: string
  read: boolean
  createdAt: number
}

// Demo notifications
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "score_change",
    title: "Score Upgraded",
    message: "Agent 0x742d...bD18 upgraded from AA to AAA (score: 967)",
    agentAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: "2",
    type: "budget_alert",
    title: "Budget Warning",
    message: "Agent 0xdD87...2148 has used 85% of daily budget limit",
    agentAddress: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    read: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: "3",
    type: "verification",
    title: "Verification Complete",
    message: "Agent 0x8Ba1...Ef99 passed verification with grade AA",
    agentAddress: "0x8Ba1f109551bD432803012645Ac136c89aFbEf99",
    read: false,
    createdAt: Date.now() - 14400000,
  },
  {
    id: "4",
    type: "score_change",
    title: "Score Downgrade",
    message: "Agent 0xCA35...733c dropped from C to D (score: 187)",
    agentAddress: "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
    read: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "5",
    type: "system",
    title: "CRE Engine Update",
    message: "Payment Volume Analysis workflow updated to v2.1 with improved accuracy",
    read: true,
    createdAt: Date.now() - 172800000,
  },
  {
    id: "6",
    type: "budget_alert",
    title: "Budget Exceeded",
    message: "Agent 0x4B08...B94D exceeded monthly budget by 5.2 ETH",
    agentAddress: "0x4B0897b0513FdBeEc7C469D9aF4fA6C0752aB94D",
    read: true,
    createdAt: Date.now() - 259200000,
  },
]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>> = {
  score_change: ChartLineUp,
  budget_alert: Wallet,
  verification: ShieldCheck,
  system: Bell,
}

const TYPE_COLORS: Record<string, string> = {
  score_change: "text-chart-2",
  budget_alert: "text-score-yellow",
  verification: "text-score-green",
  system: "text-muted-foreground",
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function AlertsPage(): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)
  const [filter, setFilter] = useState<string>("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  function markAllRead(): void {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string): void {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRinging className="size-5" />
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Notifications
              </h2>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              <Checks className="size-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: `Unread (${unreadCount})` },
            { key: "score_change", label: "Score" },
            { key: "budget_alert", label: "Budget" },
            { key: "verification", label: "Verification" },
            { key: "system", label: "System" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "hover:bg-accent text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0 divide-y">
            {filtered.length > 0 ? (
              filtered.map((notif) => {
                const Icon = ICON_MAP[notif.type] ?? Bell
                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => markRead(notif.id)}
                    className={`w-full text-left flex items-start gap-3 p-4 transition-colors cursor-pointer hover:bg-accent/50 ${
                      !notif.read ? "bg-accent/30" : ""
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 ${TYPE_COLORS[notif.type]}`}>
                      <Icon className="size-5" weight={notif.read ? "regular" : "fill"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-medium ${!notif.read ? "" : "text-muted-foreground"}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="size-1.5 rounded-full bg-chart-2 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {timeAgo(notif.createdAt)}
                        </span>
                        {notif.agentAddress && (
                          <Link
                            href={`/agents/${notif.agentAddress}`}
                            className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notif.agentAddress.slice(0, 6)}...{notif.agentAddress.slice(-4)}
                          </Link>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="size-8 text-score-green mb-2" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  {filter === "all"
                    ? "You're all caught up"
                    : "No notifications match this filter"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
