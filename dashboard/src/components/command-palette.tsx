"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  House,
  Robot,
  ArrowsLeftRight,
  ChartLine,
  ChartLineUp,
  Globe,
  Wallet,
  ShieldCheck,
  Gear,
  Plus,
  Sun,
  Moon,
  Desktop,
  Bell,
  Key,
  Users,
} from "@phosphor-icons/react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandPalette(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    function down(e: KeyboardEvent): void {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return (): void => {
      document.removeEventListener("keydown", down)
    }
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for pages, actions, and settings."
      showCloseButton={false}
    >
      <CommandInput placeholder="Search agents, pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem
            value="overview home dashboard"
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <House size={16} />
            <span>Overview</span>
          </CommandItem>
          <CommandItem
            value="agents registry list"
            onSelect={() => runCommand(() => router.push("/agents"))}
          >
            <Robot size={16} />
            <span>Agents</span>
          </CommandItem>
          <CommandItem
            value="transactions tx activity"
            onSelect={() => runCommand(() => router.push("/transactions"))}
          >
            <ArrowsLeftRight size={16} />
            <span>Transactions</span>
          </CommandItem>
          <CommandItem
            value="cre engine scoring workflows chainlink"
            onSelect={() => runCommand(() => router.push("/cre"))}
          >
            <ChartLineUp size={16} />
            <span>CRE Engine</span>
          </CommandItem>
          <CommandItem
            value="ecosystem intelligence network macro overview"
            onSelect={() => runCommand(() => router.push("/ecosystem"))}
          >
            <Globe size={16} />
            <span>Ecosystem Intelligence</span>
          </CommandItem>
          <CommandItem
            value="scores leaderboard reputation grade"
            onSelect={() => runCommand(() => router.push("/scores"))}
          >
            <ChartLine size={16} />
            <span>Scores</span>
          </CommandItem>
          <CommandItem
            value="budgets limits spending"
            onSelect={() => runCommand(() => router.push("/budgets"))}
          >
            <Wallet size={16} />
            <span>Budgets</span>
          </CommandItem>
          <CommandItem
            value="verify agent check validate"
            onSelect={() => runCommand(() => router.push("/verify"))}
          >
            <ShieldCheck size={16} />
            <span>Verify Agent</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            value="register new agent create"
            onSelect={() =>
              runCommand(() => {
                window.dispatchEvent(new CustomEvent("qova:register-agent"))
                router.push("/agents")
              })
            }
          >
            <Plus size={16} />
            <span>Register New Agent</span>
          </CommandItem>
          <CommandItem
            value="run verification check"
            onSelect={() => runCommand(() => router.push("/verify"))}
          >
            <ShieldCheck size={16} />
            <span>Run Verification</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            value="general settings config preferences"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Gear size={16} />
            <span>General Settings</span>
          </CommandItem>
          <CommandItem
            value="api keys tokens"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Key size={16} />
            <span>API Keys</span>
          </CommandItem>
          <CommandItem
            value="team members"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Users size={16} />
            <span>Team</span>
          </CommandItem>
          <CommandItem
            value="notifications alerts"
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            value="light mode theme"
            onSelect={() => runCommand(() => setTheme("light"))}
          >
            <Sun size={16} />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem
            value="dark mode theme"
            onSelect={() => runCommand(() => setTheme("dark"))}
          >
            <Moon size={16} />
            <span>Dark Mode</span>
          </CommandItem>
          <CommandItem
            value="system auto theme"
            onSelect={() => runCommand(() => setTheme("system"))}
          >
            <Desktop size={16} />
            <span>System Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
