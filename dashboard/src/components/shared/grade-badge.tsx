import { cn } from "@/lib/utils"

const gradeConfig: Record<string, { bg: string; text: string }> = {
  AAA: { bg: "bg-[var(--status-green-bg)]", text: "text-[var(--status-green-text)]" },
  AA: { bg: "bg-[var(--status-green-bg)]", text: "text-[var(--status-green-text)]" },
  A: { bg: "bg-[var(--status-blue-bg)]", text: "text-[var(--status-blue-text)]" },
  BBB: { bg: "bg-[var(--status-blue-bg)]", text: "text-[var(--status-blue-text)]" },
  BB: { bg: "bg-[var(--status-orange-bg)]", text: "text-[var(--status-orange-text)]" },
  B: { bg: "bg-[var(--status-orange-bg)]", text: "text-[var(--status-orange-text)]" },
  C: { bg: "bg-[var(--status-red-bg)]", text: "text-[var(--status-red-text)]" },
  D: { bg: "bg-[var(--status-red-bg)]", text: "text-[var(--status-red-text)]" },
}

interface GradeBadgeProps {
  grade: string
  className?: string
}

export function GradeBadge({ grade, className }: GradeBadgeProps): React.ReactElement {
  const config = gradeConfig[grade] ?? gradeConfig.D
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      {grade}
    </span>
  )
}
