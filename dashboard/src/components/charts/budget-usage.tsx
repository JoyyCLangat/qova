"use client";

function getFillColor(percentage: number): string {
	if (percentage < 60) return "#22C55E";
	if (percentage <= 80) return "#FACC15";
	return "#EF4444";
}

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
				<span className="text-[hsl(var(--foreground))]">{label}</span>
				<span className="font-mono text-xs" style={{ color: getFillColor(clamped) }}>
					{clamped.toFixed(1)}%
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{
						width: `${clamped}%`,
						backgroundColor: getFillColor(clamped),
					}}
				/>
			</div>
			<p className="text-xs text-[hsl(var(--muted-foreground))]">
				{used} / {total}
			</p>
		</div>
	);
}
