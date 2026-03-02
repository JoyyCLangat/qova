"use client"

import { cn } from "@/lib/utils"

interface Tab {
  label: string
  value: string
  count?: number
}

interface TabNavProps {
  tabs: Tab[]
  active: string
  onChange: (value: string) => void
  className?: string
}

export function TabNav({ tabs, active, onChange, className }: TabNavProps): React.ReactElement {
  return (
    <div className={cn("flex gap-1 border-b border-[var(--border-default)]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-colors",
            active === tab.value
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-[var(--text-tertiary)]">{tab.count}</span>
          )}
          {active === tab.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--text-primary)]" />
          )}
        </button>
      ))}
    </div>
  )
}
