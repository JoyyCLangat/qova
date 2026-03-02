import { cn } from "@/lib/utils"

interface QovaCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: "sm" | "md" | "lg"
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function QovaCard({
  children,
  className,
  hover = false,
  padding = "md",
}: QovaCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl",
        paddingMap[padding],
        hover && "hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}
