"use client"

import { useState } from "react"
import {
  Users,
  UserPlus,
  Crown,
  ShieldCheck,
  Eye,
  Code,
  CurrencyCircleDollar,
  Trash,
  EnvelopeSimple,
  Copy,
  Check,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Role = "owner" | "admin" | "developer" | "viewer" | "billing"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  joinedAt: number
  lastActive: number
}

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  owner: { label: "Owner", icon: Crown, color: "text-score-yellow" },
  admin: { label: "Admin", icon: ShieldCheck, color: "text-chart-2" },
  developer: { label: "Developer", icon: Code, color: "text-muted-foreground" },
  viewer: { label: "Viewer", icon: Eye, color: "text-muted-foreground" },
  billing: { label: "Billing", icon: CurrencyCircleDollar, color: "text-muted-foreground" },
}

const DEMO_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "admin@qova.cc",
    role: "owner",
    joinedAt: Date.now() - 90 * 86400000,
    lastActive: Date.now() - 60000,
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@qova.cc",
    role: "admin",
    joinedAt: Date.now() - 60 * 86400000,
    lastActive: Date.now() - 3600000,
  },
  {
    id: "3",
    name: "Sarah Kim",
    email: "sarah@qova.cc",
    role: "developer",
    joinedAt: Date.now() - 30 * 86400000,
    lastActive: Date.now() - 86400000,
  },
  {
    id: "4",
    name: "Jordan Lee",
    email: "jordan@qova.cc",
    role: "viewer",
    joinedAt: Date.now() - 14 * 86400000,
    lastActive: Date.now() - 172800000,
  },
]

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full access. Can manage billing, team, and all settings.",
  admin: "Can manage agents, scores, and team members.",
  developer: "Can view data, manage API keys and webhooks.",
  viewer: "Read-only access to dashboards and reports.",
  billing: "Can manage billing and view invoices.",
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function MemberRow({ member }: { member: TeamMember }): React.ReactElement {
  const config = ROLE_CONFIG[member.role]
  const Icon = config.icon
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{member.name}</span>
          {member.role === "owner" && (
            <Crown className="size-3.5 text-score-yellow" weight="fill" />
          )}
        </div>
        <span className="text-xs text-muted-foreground truncate block">
          {member.email}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] text-muted-foreground hidden sm:block">
          {timeAgo(member.lastActive)}
        </span>
        <Badge variant="outline" className="gap-1 text-xs">
          <Icon className={`size-3 ${config.color}`} />
          {config.label}
        </Badge>
        {member.role !== "owner" && (
          <Button variant="ghost" size="sm" className="size-7 p-0 text-muted-foreground hover:text-destructive">
            <Trash className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function TeamPage(): React.ReactElement {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("viewer")
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteLink = "https://app.qova.cc/invite/demo-org-abc123"

  function handleCopyLink(): void {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mx-auto max-w-3xl w-full space-y-6">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users size={16} />
                  Team Members
                </CardTitle>
                <CardDescription>
                  {DEMO_MEMBERS.length} members in your organization.
                </CardDescription>
              </div>
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="size-4 mr-1" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        placeholder="colleague@company.com"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][])
                          .filter(([r]) => r !== "owner")
                          .map(([role, cfg]) => {
                            const RIcon = cfg.icon
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setInviteRole(role)}
                                className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors cursor-pointer ${
                                  inviteRole === role
                                    ? "border-foreground bg-accent"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                <RIcon className={`size-4 ${cfg.color}`} />
                                <div>
                                  <span className="font-medium">{cfg.label}</span>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {ROLE_DESCRIPTIONS[role]}
                                  </p>
                                </div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button disabled={!inviteEmail.includes("@")}>
                      <EnvelopeSimple className="size-4 mr-1" />
                      Send Invite
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {DEMO_MEMBERS.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </CardContent>
        </Card>

        {/* Invite Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Invite Link</CardTitle>
            <CardDescription>
              Share this link to invite people to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="font-mono text-xs bg-muted"
              />
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              New members join with the Viewer role by default. You can update their role after they join.
            </p>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Role Permissions</CardTitle>
            <CardDescription>
              Overview of what each role can access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
                const RIcon = cfg.icon
                return (
                  <div key={role} className="flex items-start gap-3 border-b py-3 last:border-b-0">
                    <RIcon className={`size-4 mt-0.5 shrink-0 ${cfg.color}`} />
                    <div>
                      <span className="text-sm font-medium">{cfg.label}</span>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_DESCRIPTIONS[role]}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
