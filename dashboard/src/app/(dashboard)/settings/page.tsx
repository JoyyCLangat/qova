"use client"

import {
  Cloud,
  Gear,
  Link as LinkIcon,
  ShieldCheck,
} from "@phosphor-icons/react"
import { useConvexAvailable } from "@/components/providers/convex-provider"
import { StatusBadge } from "@/components/data/status-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CHAIN_CONFIG = {
  name: process.env.NEXT_PUBLIC_CHAIN_NAME ?? "Base",
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID ?? "8453",
  explorer: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://basescan.org",
  explorerLabel: process.env.NEXT_PUBLIC_EXPLORER_LABEL ?? "basescan.org",
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-4 last:border-b-0">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-1">{children}</div>
    </div>
  )
}

export default function SettingsPage(): React.ReactElement {
  const convexAvailable = useConvexAvailable()
  const apiConfigured = !!process.env.NEXT_PUBLIC_API_URL

  return (
    <div className="px-4 lg:px-6">
      <div className="mx-auto max-w-3xl w-full space-y-6">
        <PageHeader
          breadcrumb="Settings"
          title="Settings"
          subtitle="Dashboard preferences and account management"
        />

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gear size={16} />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal account information managed through Clerk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Qova User"
                  disabled
                  className="bg-muted"
                />
                <p className="text-[10px] text-muted-foreground">
                  Managed by Clerk. Update in your profile.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="user@qova.cc"
                  disabled
                  className="bg-muted"
                />
                <p className="text-[10px] text-muted-foreground">
                  Primary email linked to your account.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Organization</Label>
              <Input
                id="org"
                placeholder="My Organization"
                disabled
                className="bg-muted"
              />
              <p className="text-[10px] text-muted-foreground">
                Organization membership is managed in Team settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud size={16} />
              System Status
            </CardTitle>
            <CardDescription>
              Service health for dashboard infrastructure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow
              label="Database"
              description="Real-time data for agents, scores, and activity"
            >
              <StatusBadge status={convexAvailable ? "active" : "inactive"} />
            </SettingRow>
            <SettingRow
              label="API"
              description="On-chain API for agent registration, scoring, and verification"
            >
              <StatusBadge status={apiConfigured ? "active" : "inactive"} />
            </SettingRow>
            <SettingRow
              label="Authentication"
              description="User identity and session management"
            >
              <StatusBadge status="active" />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Network */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <LinkIcon size={16} />
              Network
            </CardTitle>
            <CardDescription>
              Blockchain network configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow label="Chain" description="Target blockchain network">
              <span className="font-mono text-xs">{CHAIN_CONFIG.name}</span>
            </SettingRow>
            <SettingRow label="Chain ID" description="Numeric chain identifier">
              <span className="font-mono text-xs">{CHAIN_CONFIG.chainId}</span>
            </SettingRow>
            <SettingRow label="Explorer" description="Block explorer for transaction verification">
              <a
                href={CHAIN_CONFIG.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {CHAIN_CONFIG.explorerLabel}
              </a>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck size={16} />
              Security
            </CardTitle>
            <CardDescription>
              Verification and trust infrastructure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow
              label="Authentication"
              description="Identity provider for user sessions"
            >
              <span className="text-xs text-muted-foreground">Clerk SIWE</span>
            </SettingRow>
            <SettingRow
              label="Score Verification"
              description="Decentralized oracle network for trust scores"
            >
              <span className="text-xs text-muted-foreground">Chainlink CRE</span>
            </SettingRow>
            <SettingRow
              label="Data Integrity"
              description="On-chain hash anchoring for score immutability"
            >
              <span className="text-xs text-muted-foreground">{CHAIN_CONFIG.name}</span>
            </SettingRow>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
