"use client";

import { Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function getFillColor(percentage: number): string {
	if (percentage < 60) return "var(--score-green)";
	if (percentage <= 80) return "var(--score-yellow)";
	return "var(--score-red)";
}

function getStatusLabel(percentage: number): string {
	if (percentage < 60) return "Healthy";
	if (percentage <= 80) return "Approaching limit";
	return "Near limit";
}

/** Single budget bar with status indicator and threshold markers. */
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
	const fillColor = getFillColor(clamped);
	const statusLabel = getStatusLabel(clamped);

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between text-sm">
				<div className="flex items-center gap-2">
					<span className="text-[var(--foreground)] font-medium">{label}</span>
					{clamped >= 80 && (
						<Warning size={14} style={{ color: fillColor }} weight="fill" />
					)}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">{statusLabel}</span>
					<span className="font-mono text-xs font-medium" style={{ color: fillColor }}>
						{clamped.toFixed(1)}%
					</span>
				</div>
			</div>
			<div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{
						width: `${clamped}%`,
						backgroundColor: fillColor,
					}}
				/>
				{/* 80% threshold marker */}
				<div
					className="absolute top-0 h-full w-px bg-muted-foreground/30"
					style={{ left: "80%" }}
				/>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-xs text-[var(--muted-foreground)]">
					{used} of {total} used
				</p>
				<p className={cn(
					"font-mono text-xs",
					clamped < 60 && "text-[var(--score-green)]",
					clamped >= 60 && clamped <= 80 && "text-[var(--score-yellow)]",
					clamped > 80 && "text-[var(--score-red)]",
				)}>
					{(() => {
						const usedNum = parseFloat(used) || 0;
						const totalNum = parseFloat(total) || 0;
						const remaining = totalNum - usedNum;
						return remaining > 0 ? `${remaining.toFixed(2)} remaining` : "Limit reached";
					})()}
				</p>
			</div>
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
