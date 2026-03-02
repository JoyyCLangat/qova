import { cn } from "@/lib/utils"
import { Info } from "@phosphor-icons/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatCardProps {
  label: string
  value: string | number
  context?: string
  tooltip?: string
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({
  label,
  value,
  context,
  tooltip,
  trend,
  className,
}: StatCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          {label}
        </span>
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3 text-[var(--text-tertiary)] cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-2xl font-semibold text-[var(--text-primary)] font-mono">{value}</p>
      {(context || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.value >= 0 ? "text-[var(--status-green-text)]" : "text-[var(--status-red-text)]"
              )}
            >
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
          )}
          {context && (
            <span className="text-xs text-[var(--text-tertiary)]">{context}</span>
          )}
        </div>
      )}
    </div>
  )
}
