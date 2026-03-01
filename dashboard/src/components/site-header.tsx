"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"

const routeTitles: Record<string, string> = {
  "/": "Overview",
  "/agents": "Agents",
  "/transactions": "Transactions",
  "/cre": "CRE Engine",
  "/scores": "Scores",
  "/budgets": "Budgets",
  "/verify": "Verify",
  "/settings": "Settings",
  "/onboarding": "Welcome",
}

function SearchTrigger(): React.ReactElement {
  function handleClick(): void {
    // Dispatch Cmd+K to open the command palette
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
      }),
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="hidden md:inline-flex gap-2 text-muted-foreground font-normal"
    >
      <span className="text-xs">Search...</span>
      <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-[11px]">&#8984;</span>K
      </kbd>
    </Button>
  )
}

export function SiteHeader(): React.ReactElement {
  const pathname = usePathname()

  const title =
    routeTitles[pathname] ??
    (pathname.startsWith("/agents/") ? "Agent Detail" :
     pathname.startsWith("/cre/") ? "Workflow Detail" : "Qova")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
