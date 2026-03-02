"use client"

import { useState } from "react"
import {
  Plugs,
  CheckCircle,
  ArrowRight,
  MagnifyingGlass,
  Link as LinkIcon,
  ShieldCheck,
  Wallet,
  ChartLineUp,
  Bell,
  Database,
  Globe,
  CurrencyCircleDollar,
  Robot,
  Lightning,
  Code,
  ChartBar,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type IntegrationCategory = "blockchain" | "oracle" | "payment" | "notification" | "data" | "analytics"

interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  icon: React.ComponentType<{ className?: string; weight?: "fill" | "regular" | "duotone" }>
  status: "connected" | "available" | "coming_soon"
  configFields?: { label: string; placeholder: string; key: string }[]
}

const CATEGORY_CONFIG: Record<IntegrationCategory, { label: string; color: string }> = {
  blockchain: { label: "Blockchain", color: "text-chart-2" },
  oracle: { label: "Oracle", color: "text-score-yellow" },
  payment: { label: "Payment", color: "text-score-green" },
  notification: { label: "Notification", color: "text-muted-foreground" },
  data: { label: "Data", color: "text-chart-2" },
  analytics: { label: "Analytics", color: "text-score-yellow" },
}

const INTEGRATIONS: Integration[] = [
  {
    id: "base-rpc",
    name: "Base L2 RPC",
    description: "Connect to Base network for on-chain agent data, transaction monitoring, and score verification.",
    category: "blockchain",
    icon: LinkIcon,
    status: "connected",
    configFields: [
      { label: "RPC URL", placeholder: "https://mainnet.base.org", key: "rpcUrl" },
      { label: "Chain ID", placeholder: "8453", key: "chainId" },
    ],
  },
  {
    id: "base-sepolia",
    name: "Base Sepolia (Testnet)",
    description: "Testnet RPC endpoint for development and testing of agent scoring workflows.",
    category: "blockchain",
    icon: LinkIcon,
    status: "connected",
    configFields: [
      { label: "RPC URL", placeholder: "https://sepolia.base.org", key: "rpcUrl" },
    ],
  },
  {
    id: "chainlink-cre",
    name: "Chainlink CRE",
    description: "Decentralized oracle network for executing credit risk evaluation workflows on-chain.",
    category: "oracle",
    icon: ChartLineUp,
    status: "connected",
    configFields: [
      { label: "Node Operator ID", placeholder: "op-xxxxx", key: "operatorId" },
      { label: "Subscription ID", placeholder: "sub-xxxxx", key: "subscriptionId" },
    ],
  },
  {
    id: "x402",
    name: "x402 Protocol",
    description: "HTTP-native payment protocol for monitoring agent payment flows and transaction authorization.",
    category: "payment",
    icon: CurrencyCircleDollar,
    status: "connected",
    configFields: [
      { label: "Facilitator URL", placeholder: "https://x402.org/facilitator", key: "facilitatorUrl" },
    ],
  },
  {
    id: "convex",
    name: "Convex",
    description: "Real-time database for agent data, scores, activity logs, and dashboard state management.",
    category: "data",
    icon: Database,
    status: "connected",
  },
  {
    id: "clerk",
    name: "Clerk Auth",
    description: "Authentication and identity management with Sign In With Ethereum (SIWE) support.",
    category: "data",
    icon: ShieldCheck,
    status: "connected",
  },
  {
    id: "coinbase-wallet",
    name: "Coinbase Wallet",
    description: "Connect Coinbase wallets for agent wallet management and USDC transaction monitoring.",
    category: "payment",
    icon: Wallet,
    status: "available",
    configFields: [
      { label: "API Key", placeholder: "cb_api_xxxxx", key: "apiKey" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send score change alerts, budget warnings, and verification results to Slack channels.",
    category: "notification",
    icon: Bell,
    status: "available",
    configFields: [
      { label: "Webhook URL", placeholder: "https://hooks.slack.com/services/...", key: "webhookUrl" },
      { label: "Channel", placeholder: "#qova-alerts", key: "channel" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    description: "Receive real-time notifications and query agent scores via a Telegram bot.",
    category: "notification",
    icon: Globe,
    status: "available",
    configFields: [
      { label: "Bot Token", placeholder: "123456:ABC-DEF...", key: "botToken" },
      { label: "Chat ID", placeholder: "-1001234567890", key: "chatId" },
    ],
  },
  {
    id: "openai-agents",
    name: "OpenAI Agents SDK",
    description: "Integrate Qova trust scores into OpenAI agent decision-making pipelines.",
    category: "analytics",
    icon: Robot,
    status: "available",
    configFields: [
      { label: "API Key", placeholder: "sk-xxxxx", key: "apiKey" },
    ],
  },
  {
    id: "langchain",
    name: "LangChain",
    description: "Use Qova as a tool in LangChain agent chains for trust-gated operations.",
    category: "analytics",
    icon: Lightning,
    status: "coming_soon",
  },
  {
    id: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    description: "Embed Qova credit checks in Vercel AI SDK tool calls and agent workflows.",
    category: "analytics",
    icon: Code,
    status: "coming_soon",
  },
  {
    id: "dune-analytics",
    name: "Dune Analytics",
    description: "Export agent score data and CRE execution metrics to Dune dashboards.",
    category: "analytics",
    icon: ChartBar,
    status: "coming_soon",
  },
]

const STATUS_CONFIG = {
  connected: { label: "Connected", class: "bg-score-green/10 text-score-green border-score-green/20" },
  available: { label: "Available", class: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  coming_soon: { label: "Coming Soon", class: "bg-muted text-muted-foreground" },
}

export default function IntegrationsPage(): React.ReactElement {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [configOpen, setConfigOpen] = useState<string | null>(null)

  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length

  const filtered = INTEGRATIONS.filter((i) => {
    const matchesSearch =
      search.length === 0 ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const selectedIntegration = configOpen
    ? INTEGRATIONS.find((i) => i.id === configOpen)
    : null

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <PageHeader
          breadcrumb="Operations"
          title="Integrations"
          subtitle="Connect Qova with your existing tools"
        />
      </div>

      {/* Search + Filters */}
      <div className="px-4 lg:px-6 space-y-3">
        <div className="relative max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "blockchain", label: "Blockchain" },
            { key: "oracle", label: "Oracle" },
            { key: "payment", label: "Payment" },
            { key: "notification", label: "Notification" },
            { key: "data", label: "Data" },
            { key: "analytics", label: "Analytics" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setCategoryFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                categoryFilter === f.key
                  ? "bg-foreground text-background"
                  : "hover:bg-accent text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      <div className="px-4 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((integration) => {
            const Icon = integration.icon
            const statusCfg = STATUS_CONFIG[integration.status]
            const catCfg = CATEGORY_CONFIG[integration.category]
            return (
              <Card key={integration.id} className="group relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg border p-2 ${
                        integration.status === "connected" ? "bg-score-green/5 border-score-green/20" : "bg-muted"
                      }`}>
                        <Icon className={`size-4 ${
                          integration.status === "connected" ? "text-score-green" : catCfg.color
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{integration.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] mt-1 ${statusCfg.class}`}
                        >
                          {integration.status === "connected" && (
                            <CheckCircle className="size-3 mr-0.5" weight="fill" />
                          )}
                          {statusCfg.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <CardDescription className="text-xs line-clamp-2 mb-3">
                    {integration.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${catCfg.color}`}>
                      {catCfg.label}
                    </span>
                    {integration.status === "connected" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setConfigOpen(integration.id)}
                      >
                        Configure
                        <ArrowRight className="size-3 ml-1" />
                      </Button>
                    ) : integration.status === "available" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setConfigOpen(integration.id)}
                      >
                        Connect
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Plugs className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No integrations found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Config Dialog */}
      <Dialog open={!!configOpen} onOpenChange={(v) => !v && setConfigOpen(null)}>
        {selectedIntegration && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <selectedIntegration.icon className="size-5" />
                {selectedIntegration.name}
              </DialogTitle>
              <DialogDescription>
                {selectedIntegration.description}
              </DialogDescription>
            </DialogHeader>
            {selectedIntegration.configFields ? (
              <div className="space-y-4 py-2">
                {selectedIntegration.configFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Input placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                This integration is automatically configured.
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigOpen(null)}>
                Cancel
              </Button>
              <Button>
                {selectedIntegration.status === "connected" ? "Save" : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
