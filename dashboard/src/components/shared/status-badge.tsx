import { cn } from "@/lib/utils"

type StatusVariant = "active" | "warning" | "critical" | "info" | "inactive"

const variantConfig: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  active: {
    bg: "bg-[var(--status-green-bg)]",
    text: "text-[var(--status-green-text)]",
    dot: "bg-[var(--status-green-text)]",
  },
  warning: {
    bg: "bg-[var(--status-orange-bg)]",
    text: "text-[var(--status-orange-text)]",
    dot: "bg-[var(--status-orange-text)]",
  },
  critical: {
    bg: "bg-[var(--status-red-bg)]",
    text: "text-[var(--status-red-text)]",
    dot: "bg-[var(--status-red-text)]",
  },
  info: {
    bg: "bg-[var(--status-blue-bg)]",
    text: "text-[var(--status-blue-text)]",
    dot: "bg-[var(--status-blue-text)]",
  },
  inactive: {
    bg: "bg-[var(--bg-input)]",
    text: "text-[var(--text-tertiary)]",
    dot: "bg-[var(--text-tertiary)]",
  },
}

interface StatusBadgeProps {
  status: StatusVariant
  label: string
  showDot?: boolean
  className?: string
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps): React.ReactElement {
  const config = variantConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full", config.dot)} />}
      {label}
    </span>
  )
}
