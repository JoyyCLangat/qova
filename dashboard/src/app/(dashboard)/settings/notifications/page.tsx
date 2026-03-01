"use client"

import { useState } from "react"
import {
  Bell,
  ChartLineUp,
  Wallet,
  ShieldCheck,
  Gear,
  EnvelopeSimple,
  DeviceMobile,
  Globe,
} from "@phosphor-icons/react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface NotificationPref {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  email: boolean
  inApp: boolean
  webhook: boolean
}

const DEFAULT_PREFS: NotificationPref[] = [
  {
    key: "score_change",
    label: "Score Changes",
    description: "When an agent's trust score is upgraded or downgraded.",
    icon: ChartLineUp,
    iconColor: "text-chart-2",
    email: true,
    inApp: true,
    webhook: true,
  },
  {
    key: "budget_alert",
    label: "Budget Alerts",
    description: "When an agent exceeds or approaches budget limits.",
    icon: Wallet,
    iconColor: "text-score-yellow",
    email: true,
    inApp: true,
    webhook: false,
  },
  {
    key: "verification",
    label: "Verification Results",
    description: "When a verification check completes for an agent.",
    icon: ShieldCheck,
    iconColor: "text-score-green",
    email: false,
    inApp: true,
    webhook: true,
  },
  {
    key: "system",
    label: "System Updates",
    description: "CRE engine updates, maintenance, and platform announcements.",
    icon: Gear,
    iconColor: "text-muted-foreground",
    email: false,
    inApp: true,
    webhook: false,
  },
]

type Channel = "email" | "inApp" | "webhook"
const CHANNEL_CONFIG: { key: Channel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "email", label: "Email", icon: EnvelopeSimple },
  { key: "inApp", label: "In-App", icon: DeviceMobile },
  { key: "webhook", label: "Webhook", icon: Globe },
]

export default function NotificationSettingsPage(): React.ReactElement {
  const [prefs, setPrefs] = useState<NotificationPref[]>(DEFAULT_PREFS)
  const [digestEnabled, setDigestEnabled] = useState(true)
  const [digestFrequency, setDigestFrequency] = useState("daily")
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState("")

  function togglePref(key: string, channel: Channel): void {
    setPrefs((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, [channel]: !p[channel] } : p,
      ),
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mx-auto max-w-3xl w-full space-y-6">
        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell size={16} />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose which notifications you receive and how.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Channel headers */}
            <div className="flex items-center gap-4 pb-3 border-b mb-1">
              <div className="flex-1" />
              {CHANNEL_CONFIG.map((ch) => {
                const ChIcon = ch.icon
                return (
                  <div key={ch.key} className="w-16 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <ChIcon className="size-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {ch.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pref rows */}
            {prefs.map((pref) => {
              const Icon = pref.icon
              return (
                <div
                  key={pref.key}
                  className="flex items-center gap-4 py-3 border-b last:border-b-0"
                >
                  <div className="flex-1 flex items-start gap-3 min-w-0">
                    <Icon className={`size-4 mt-0.5 shrink-0 ${pref.iconColor}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {pref.description}
                      </p>
                    </div>
                  </div>
                  {CHANNEL_CONFIG.map((ch) => (
                    <div key={ch.key} className="w-16 flex justify-center">
                      <Switch
                        checked={pref[ch.key]}
                        onCheckedChange={() => togglePref(pref.key, ch.key)}
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Digest Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <EnvelopeSimple size={16} />
              Email Digest
            </CardTitle>
            <CardDescription>
              Receive a summary of activity instead of individual emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="digest-toggle">Enable Email Digest</Label>
                <p className="text-xs text-muted-foreground">
                  Batch notifications into a single digest email.
                </p>
              </div>
              <Switch
                id="digest-toggle"
                checked={digestEnabled}
                onCheckedChange={setDigestEnabled}
              />
            </div>

            {digestEnabled && (
              <div className="flex gap-2 pt-2">
                {["daily", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setDigestFrequency(freq)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      digestFrequency === freq
                        ? "bg-foreground text-background"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DeviceMobile size={16} />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Pause non-critical notifications during specific hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">
                  Suppress email and in-app notifications from 10 PM to 8 AM.
                </p>
              </div>
              <Switch
                id="quiet-hours"
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>
            {quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="quiet-start" className="text-xs">Start</Label>
                  <Input id="quiet-start" type="time" defaultValue="22:00" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="quiet-end" className="text-xs">End</Label>
                  <Input id="quiet-end" type="time" defaultValue="08:00" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slack / External Webhook */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe size={16} />
              Slack Integration
            </CardTitle>
            <CardDescription>
              Forward notifications to a Slack channel via incoming webhook.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!slackWebhook.startsWith("https://")}
                >
                  Test
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Create an incoming webhook in your Slack workspace settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end pb-6">
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
