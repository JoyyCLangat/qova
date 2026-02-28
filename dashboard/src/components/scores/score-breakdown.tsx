"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScoreBreakdownFactor {
	raw: string | number;
	normalized: number;
	weight: number;
	contribution: number;
}

interface ScoreBreakdownProps {
	factors: Record<string, ScoreBreakdownFactor>;
	totalScore: number;
}

const FACTOR_LABELS: Record<string, string> = {
	transactionVolume: "Transaction Volume",
	transactionCount: "Transaction Count",
	successRate: "Success Rate",
	budgetCompliance: "Budget Compliance",
	accountAge: "Account Age",
};

function getBarColor(normalized: number): "green" | "yellow" | "red" {
	if (normalized >= 0.7) return "green";
	if (normalized >= 0.4) return "yellow";
	return "red";
}

export function ScoreBreakdown({ factors, totalScore }: ScoreBreakdownProps): React.ReactElement {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const sortedEntries = Object.entries(factors).sort(([, a], [, b]) => b.weight - a.weight);

	return (
		<div className="space-y-3">
			{sortedEntries.map(([key, factor], index) => {
				const label = FACTOR_LABELS[key] ?? key;
				const color = getBarColor(factor.normalized);
				const fillPercent = mounted ? factor.normalized * 100 : 0;

				return (
					<div key={key} className="space-y-1.5">
						<div className="flex items-center justify-between text-sm">
							<span className="text-[var(--foreground)]">
								{label}{" "}
								<span className="text-[var(--muted-foreground)]">
									({(factor.weight * 100).toFixed(0)}%)
								</span>
							</span>
							<span className="font-mono text-xs text-[var(--muted-foreground)]">
								{factor.contribution.toFixed(0)}
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full border border-[var(--border)]">
							<div
								className={cn("h-full rounded-full")}
								style={{
									width: `${fillPercent}%`,
									backgroundColor: `var(--score-${color})`,
									transition: `width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 100}ms`,
								}}
							/>
						</div>
					</div>
				);
			})}
			<div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm font-medium">
				<span>Total Score</span>
				<span className="font-mono">{totalScore}</span>
			</div>
		</div>
	);
}
