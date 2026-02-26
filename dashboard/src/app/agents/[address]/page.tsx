"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { use, useState } from "react";
import { BudgetUsage } from "@/components/charts/budget-usage";
import { AppLayout } from "@/components/layout/app-layout";
import { ScoreBadge } from "@/components/scores/score-badge";
import { ScoreBreakdown } from "@/components/scores/score-breakdown";
import { ScoreRing } from "@/components/scores/score-ring";
import { useAgent } from "@/hooks/use-agent";
import { useBudget } from "@/hooks/use-budget";
import { useScoreBreakdown } from "@/hooks/use-score-breakdown";
import { useTransactions } from "@/hooks/use-transactions";
import { timeAgo } from "@/lib/constants";

function CopyButton({ text }: { text: string }): React.ReactElement {
	const [copied, setCopied] = useState(false);

	function handleCopy(): void {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="inline-flex items-center justify-center rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
			aria-label="Copy address"
		>
			{copied ? <Check size={14} /> : <Copy size={14} />}
		</button>
	);
}

export default function AgentDetailPage({
	params,
}: {
	params: Promise<{ address: string }>;
}): React.ReactElement {
	const { address } = use(params);
	const { data: agent, loading: agentLoading, isDemo } = useAgent(address);
	const { data: breakdown, loading: breakdownLoading } = useScoreBreakdown(address);
	const { data: txStats, loading: txLoading } = useTransactions(address);
	const { data: budget, loading: budgetLoading } = useBudget(address);

	const anyLoading = agentLoading || breakdownLoading || txLoading || budgetLoading;

	if (anyLoading || !agent) {
		return (
			<AppLayout>
				<div className="space-y-6">
					<div className="h-60 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="h-48 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
						<div className="h-48 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
					</div>
				</div>
			</AppLayout>
		);
	}

	const dailyPct = budget ? Number.parseFloat(budget.utilization.daily) : 0;
	const monthlyPct = budget ? Number.parseFloat(budget.utilization.monthly) : 0;

	return (
		<AppLayout isDemo={isDemo}>
			{/* Hero */}
			<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
					<ScoreRing score={agent.score} grade={agent.grade} size={180} />

					<div className="flex-1 space-y-4">
						{/* Address */}
						<div className="flex items-center gap-2">
							<span className="font-mono text-sm text-[hsl(var(--foreground))]">{agent.agent}</span>
							<CopyButton text={agent.agent} />
							<a
								href={agent.explorerUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
							>
								<ExternalLink size={14} />
							</a>
						</div>

						{/* Meta row */}
						<div className="flex flex-wrap items-center gap-3">
							<ScoreBadge grade={agent.grade} score={agent.score} showScore size="lg" />
							<span className="text-xs text-[hsl(var(--muted-foreground))]">
								Last updated {timeAgo(agent.lastUpdated)}
							</span>
							<span className="text-xs text-[hsl(var(--muted-foreground))]">
								{agent.updateCount} updates
							</span>
						</div>

						{/* Score bar visual */}
						<div className="space-y-1">
							<div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
								<span>Score Progress</span>
								<span className="font-mono">{agent.score}/1000</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
								<div
									className="h-full rounded-full transition-all duration-700 ease-out"
									style={{
										width: `${agent.scorePercentage}%`,
										backgroundColor: agent.gradeColor,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Details grid */}
			<div className="mt-6 grid gap-6 lg:grid-cols-2">
				{/* Score Breakdown */}
				<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
					<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">
						Score Breakdown
					</h2>
					{breakdown ? (
						<ScoreBreakdown factors={breakdown.factors} totalScore={breakdown.score} />
					) : (
						<p className="text-xs text-[hsl(var(--muted-foreground))]">No breakdown available</p>
					)}
				</div>

				{/* Transaction Stats + Budget */}
				<div className="space-y-6">
					{/* Transaction Stats */}
					<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
						<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">
							Transaction Stats
						</h2>
						{txStats ? (
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs text-[hsl(var(--muted-foreground))]">Total Count</p>
									<p className="font-mono text-lg font-bold text-[hsl(var(--foreground))]">
										{txStats.totalCount}
									</p>
								</div>
								<div>
									<p className="text-xs text-[hsl(var(--muted-foreground))]">Total Volume</p>
									<p className="font-mono text-lg font-bold text-[hsl(var(--foreground))]">
										{txStats.totalVolume}
									</p>
								</div>
								<div>
									<p className="text-xs text-[hsl(var(--muted-foreground))]">Success Rate</p>
									<p className="font-mono text-lg font-bold text-[hsl(var(--foreground))]">
										{txStats.successRate}
									</p>
								</div>
								<div>
									<p className="text-xs text-[hsl(var(--muted-foreground))]">Last Activity</p>
									<p className="text-sm text-[hsl(var(--foreground))]">
										{timeAgo(txStats.lastActivity)}
									</p>
								</div>
							</div>
						) : (
							<p className="text-xs text-[hsl(var(--muted-foreground))]">No transaction data</p>
						)}
					</div>

					{/* Budget */}
					<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
						<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">
							Budget Utilization
						</h2>
						{budget ? (
							<div className="space-y-4">
								<BudgetUsage
									label="Daily"
									percentage={dailyPct}
									used={budget.usage.dailySpent}
									total={budget.config.dailyLimit}
								/>
								<BudgetUsage
									label="Monthly"
									percentage={monthlyPct}
									used={budget.usage.monthlySpent}
									total={budget.config.monthlyLimit}
								/>
							</div>
						) : (
							<p className="text-xs text-[hsl(var(--muted-foreground))]">No budget data</p>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
