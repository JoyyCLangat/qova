"use client";

function getFillColor(percentage: number): string {
	if (percentage < 60) return "var(--score-green)";
	if (percentage <= 80) return "var(--score-yellow)";
	return "var(--score-red)";
}

/** Single budget bar -- used by existing pages. */
export function BudgetUsage({
	label,
	percentage,
	total,
	used,
}: {
	label: string;
	percentage: number;
	total: string;
	used: string;
}): React.ReactElement {
	const clamped = Math.max(0, Math.min(100, percentage));

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between text-sm">
				<span className="text-[var(--foreground)]">{label}</span>
				<span className="font-mono text-xs font-medium" style={{ color: getFillColor(clamped) }}>
					{clamped.toFixed(1)}%
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{
						width: `${clamped}%`,
						backgroundColor: getFillColor(clamped),
					}}
				/>
			</div>
			<p className="text-xs text-[var(--muted-foreground)]">
				{used} / {total}
			</p>
		</div>
	);
}

/** Compound budget panel showing daily + monthly. */
export function BudgetUsagePanel({
	daily,
	monthly,
}: {
	daily: { spent: string; limit: string; utilization: number };
	monthly: { spent: string; limit: string; utilization: number };
}): React.ReactElement {
	return (
		<div className="space-y-5">
			<BudgetUsage
				label="Daily Budget"
				percentage={daily.utilization}
				used={daily.spent}
				total={daily.limit}
			/>
			<BudgetUsage
				label="Monthly Budget"
				percentage={monthly.utilization}
				used={monthly.spent}
				total={monthly.limit}
			/>
		</div>
	);
}
