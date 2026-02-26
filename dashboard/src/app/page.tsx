"use client";

import { Activity, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { ScoreDistribution } from "@/components/charts/score-distribution";
import { AppLayout } from "@/components/layout/app-layout";
import { ScoreBadge } from "@/components/scores/score-badge";
import { useAgents } from "@/hooks/use-agents";
import { timeAgo } from "@/lib/constants";
import { SEED_ACTIVITY } from "@/lib/seed-data";

function StatCard({
	label,
	value,
	sub,
	icon: Icon,
}: {
	label: string;
	value: string;
	sub?: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
}): React.ReactElement {
	return (
		<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
					{label}
				</span>
				<Icon size={16} className="text-[hsl(var(--muted-foreground))]" />
			</div>
			<p className="mt-2 font-mono text-2xl font-bold text-[hsl(var(--foreground))]">{value}</p>
			{sub && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{sub}</p>}
		</div>
	);
}

export default function OverviewPage(): React.ReactElement {
	const { data: agents, loading, isDemo } = useAgents();

	if (loading || !agents) {
		return (
			<AppLayout>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-28 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
						/>
					))}
				</div>
			</AppLayout>
		);
	}

	const avgScore = Math.round(agents.reduce((sum, a) => sum + a.score, 0) / agents.length);
	const highGrade = agents.filter((a) => a.score >= 700).length;

	return (
		<AppLayout isDemo={isDemo}>
			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Total Agents"
					value={String(agents.length)}
					sub="Registered on-chain"
					icon={Users}
				/>
				<StatCard
					label="Average Score"
					value={String(avgScore)}
					sub={`${((avgScore / 1000) * 100).toFixed(1)}% of max`}
					icon={TrendingUp}
				/>
				<StatCard
					label="High Grade"
					value={String(highGrade)}
					sub="Agents with score >= 700"
					icon={Shield}
				/>
				<StatCard
					label="Recent Activity"
					value={String(SEED_ACTIVITY.length)}
					sub="Transactions in last 24h"
					icon={Activity}
				/>
			</div>

			{/* Grid: chart + top agents */}
			<div className="mt-6 grid gap-6 lg:grid-cols-2">
				{/* Score Distribution */}
				<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
					<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">
						Score Distribution
					</h2>
					<ScoreDistribution agents={agents} />
				</div>

				{/* Top Agents */}
				<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-sm font-medium text-[hsl(var(--foreground))]">Top Agents</h2>
						<Link
							href="/agents"
							className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
						>
							View all
						</Link>
					</div>
					<div className="space-y-3">
						{agents
							.slice()
							.sort((a, b) => b.score - a.score)
							.slice(0, 5)
							.map((agent, idx) => (
								<Link
									key={agent.agent}
									href={`/agents/${agent.agent}`}
									className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[hsl(var(--accent))]"
								>
									<span className="w-5 text-center font-mono text-xs text-[hsl(var(--muted-foreground))]">
										{idx + 1}
									</span>
									<span className="flex-1 truncate font-mono text-sm text-[hsl(var(--foreground))]">
										{agent.addressShort}
									</span>
									<ScoreBadge grade={agent.grade} size="xs" />
									<span className="w-12 text-right font-mono text-xs text-[hsl(var(--muted-foreground))]">
										{agent.score}
									</span>
								</Link>
							))}
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="mt-6 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
				<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">Recent Activity</h2>
				<div className="space-y-2">
					{SEED_ACTIVITY.map((tx, idx) => (
						<div
							key={`${tx.agent}-${idx}`}
							className="flex items-center gap-4 rounded-md px-3 py-2 text-sm"
						>
							<span className="w-20 font-mono text-xs text-[hsl(var(--muted-foreground))]">
								{tx.addressShort}
							</span>
							<span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
								{tx.type}
							</span>
							<span className="flex-1" />
							<span className="font-mono text-xs text-[hsl(var(--foreground))]">{tx.amount}</span>
							<span className="w-16 text-right text-xs text-[hsl(var(--muted-foreground))]">
								{timeAgo(tx.time)}
							</span>
						</div>
					))}
				</div>
			</div>
		</AppLayout>
	);
}
