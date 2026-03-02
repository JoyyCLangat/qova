import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps): React.ReactElement {
  return (
    <span
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]",
        className
      )}
    >
      {children}
    </span>
  )
}
