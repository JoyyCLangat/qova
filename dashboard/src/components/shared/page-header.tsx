import { cn } from "@/lib/utils"

interface PageHeaderProps {
  breadcrumb?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        {breadcrumb && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
