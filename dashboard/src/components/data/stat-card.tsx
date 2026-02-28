import { Minus, TrendDown, TrendUp } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

interface StatCardProps {
	label: string;
	value: string | number;
	trend?: {
		value: number;
		direction: "up" | "down" | "flat";
	};
	icon?: React.ReactNode;
	accentColor?: string;
}

export function StatCard({
	label,
	value,
	trend,
	icon,
	accentColor = "var(--primary)",
}: StatCardProps): React.ReactElement {
	return (
		<div
			className={cn("rounded-lg border border-l-[3px] bg-[var(--card)] p-5")}
			style={{ borderLeftColor: accentColor }}
		>
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
						{label}
					</p>
					<p className="font-heading text-3xl font-semibold text-[var(--card-foreground)]">
						{value}
					</p>
					{trend && (
						<div className="flex items-center gap-1">
							{trend.direction === "up" && (
								<TrendUp size={14} className="text-[var(--score-green)]" weight="bold" />
							)}
							{trend.direction === "down" && (
								<TrendDown size={14} className="text-[var(--score-red)]" weight="bold" />
							)}
							{trend.direction === "flat" && (
								<Minus size={14} className="text-[var(--muted-foreground)]" weight="bold" />
							)}
							<span
								className={cn(
									"text-xs font-medium",
									trend.direction === "up" && "text-[var(--score-green)]",
									trend.direction === "down" && "text-[var(--score-red)]",
									trend.direction === "flat" && "text-[var(--muted-foreground)]",
								)}
							>
								{trend.direction === "up" ? "+" : ""}
								{trend.value}%
							</span>
						</div>
					)}
				</div>
				{icon && <div className="text-[var(--muted-foreground)]">{icon}</div>}
			</div>
		</div>
	);
}
