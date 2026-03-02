"use client"

import { MagnifyingGlass, FunnelSimple, Rows, SquaresFour } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  view?: "grid" | "list"
  onViewChange?: (view: "grid" | "list") => void
  actions?: React.ReactNode
  className?: string
}

export function FilterBar({
  onSearch,
  placeholder = "Search...",
  view,
  onViewChange,
  actions,
  className,
}: FilterBarProps): React.ReactElement {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex-1 max-w-sm">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="h-9 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--text-primary)]"
        />
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">
        <FunnelSimple className="size-4" />
        Filter
      </button>
      {view && onViewChange && (
        <div className="flex items-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-2 rounded-l-lg",
              view === "grid" ? "bg-[var(--bg-sidebar-active)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
            )}
          >
            <SquaresFour className="size-4" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "p-2 rounded-r-lg",
              view === "list" ? "bg-[var(--bg-sidebar-active)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
            )}
          >
            <Rows className="size-4" />
          </button>
        </div>
      )}
      {actions}
    </div>
  )
}
