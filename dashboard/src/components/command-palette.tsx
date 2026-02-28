"use client"

import {
  ArrowsLeftRight,
  ChartBar,
  ChartLine,
  Gear,
  MagnifyingGlass,
  Robot,
  ShieldCheck,
  Wallet,
  Plus,
  Moon,
  Sun,
} from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const navigationItems = [
  {
    label: "Overview",
    icon: ChartBar,
    href: "/",
    keywords: ["home", "dashboard"],
  },
  {
    label: "Agents",
    icon: Robot,
    href: "/agents",
    keywords: ["registry", "list"],
  },
  {
    label: "Transactions",
    icon: ArrowsLeftRight,
    href: "/transactions",
    keywords: ["tx", "activity"],
  },
  {
    label: "Scores",
    icon: ChartLine,
    href: "/scores",
    keywords: ["leaderboard", "reputation", "grade"],
  },
  {
    label: "Budgets",
    icon: Wallet,
    href: "/budgets",
    keywords: ["limits", "spending"],
  },
  {
    label: "Verify",
    icon: ShieldCheck,
    href: "/verify",
    keywords: ["check", "validate"],
  },
  {
    label: "Settings",
    icon: Gear,
    href: "/settings",
    keywords: ["config", "preferences"],
  },
]

export function CommandPalette(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return (): void => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [],
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for pages, actions, and settings."
      showCloseButton={false}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.label} ${item.keywords.join(" ")}`}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            value="register agent new"
            onSelect={() => runCommand(() => router.push("/agents"))}
          >
            <Plus size={16} />
            <span>Register New Agent</span>
          </CommandItem>
          <CommandItem
            value="verify agent check"
            onSelect={() => runCommand(() => router.push("/verify"))}
          >
            <ShieldCheck size={16} />
            <span>Verify Agent</span>
          </CommandItem>
          <CommandItem
            value="search lookup find"
            onSelect={() => runCommand(() => router.push("/scores"))}
          >
            <MagnifyingGlass size={16} />
            <span>Score Lookup</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            value="dark mode theme"
            onSelect={() => runCommand(() => setTheme("dark"))}
          >
            <Moon size={16} />
            <span>Dark Mode</span>
            {theme === "dark" && (
              <CommandShortcut>Active</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            value="light mode theme"
            onSelect={() => runCommand(() => setTheme("light"))}
          >
            <Sun size={16} />
            <span>Light Mode</span>
            {theme === "light" && (
              <CommandShortcut>Active</CommandShortcut>
            )}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
