"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useQuery } from "convex/react"
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
  MagnifyingGlass,
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
import { useConvexAvailable } from "@/components/providers/convex-provider"
import { api } from "../../convex/_generated/api"
import { Badge } from "@/components/ui/badge"

function gradeColor(grade: string): string {
  const g = grade.toUpperCase()
  if (["AAA", "AA", "A"].includes(g)) return "text-score-green"
  if (["BBB", "BB", "B"].includes(g)) return "text-score-yellow"
  return "text-score-red"
}

export function CommandPalette(): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const router = useRouter()
  const { setTheme } = useTheme()
  const convexAvailable = useConvexAvailable()

  // Debounced search term for agent queries
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  React.useEffect(() => {
    if (search.length < 2) {
      setDebouncedSearch("")
      return
    }
    const timer = setTimeout(() => setDebouncedSearch(search), 200)
    return (): void => clearTimeout(timer)
  }, [search])

  // Query agents when search term is long enough
  const agentResults = useQuery(
    api.queries.agents.search,
    convexAvailable && debouncedSearch.length >= 2
      ? { term: debouncedSearch }
      : "skip",
  )

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

  // Reset search when dialog closes
  React.useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const agents = agentResults ?? []

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for agents, pages, actions, and settings."
      showCloseButton={false}
    >
      <CommandInput
        placeholder="Search agents by address, pages, actions..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Agent search results */}
        {agents.length > 0 && (
          <>
            <CommandGroup heading="Agents">
              {agents.slice(0, 6).map((agent) => (
                <CommandItem
                  key={agent._id}
                  value={`agent ${agent.address} ${agent.addressShort} ${agent.grade}`}
                  onSelect={() =>
                    runCommand(() => router.push(`/agents/${agent.address}`))
                  }
                >
                  <Robot size={16} />
                  <span className="font-mono text-xs">{agent.addressShort}</span>
                  <Badge variant="outline" className={`ml-auto text-[10px] ${gradeColor(agent.grade)}`}>
                    {agent.grade}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {agent.score}
                  </span>
                </CommandItem>
              ))}
              {agents.length > 6 && (
                <CommandItem
                  value="view all agent results"
                  onSelect={() => runCommand(() => router.push("/agents"))}
                >
                  <MagnifyingGlass size={16} />
                  <span className="text-muted-foreground">
                    View all {agents.length} results
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

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
            value="api keys tokens developer"
            onSelect={() => runCommand(() => router.push("/developers/keys"))}
          >
            <Key size={16} />
            <span>API Keys</span>
          </CommandItem>
          <CommandItem
            value="team members organization invite"
            onSelect={() => runCommand(() => router.push("/settings/team"))}
          >
            <Users size={16} />
            <span>Team</span>
          </CommandItem>
          <CommandItem
            value="notifications alerts preferences email digest"
            onSelect={() => runCommand(() => router.push("/settings/notifications"))}
          >
            <Bell size={16} />
            <span>Notification Preferences</span>
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
