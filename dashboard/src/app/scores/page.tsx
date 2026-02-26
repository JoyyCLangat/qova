"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScoreDistribution } from "@/components/charts/score-distribution";
import { AppLayout } from "@/components/layout/app-layout";
import { ScoreBadge } from "@/components/scores/score-badge";
import { ScoreBreakdown } from "@/components/scores/score-breakdown";
import { ScoreRing } from "@/components/scores/score-ring";
import { useAgents } from "@/hooks/use-agents";
import { useScoreBreakdown } from "@/hooks/use-score-breakdown";

function BreakdownPanel({ address }: { address: string }): React.ReactElement {
	const { data: breakdown, loading } = useScoreBreakdown(address);

	if (loading) {
		return (
			<div className="h-48 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
		);
	}

	if (!breakdown) {
		return (
			<p className="text-xs text-[hsl(var(--muted-foreground))]">
				Enter an address to view score breakdown
			</p>
		);
	}

	return (
		<div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
			<ScoreRing score={breakdown.score} grade={breakdown.grade} size={160} />
			<div className="flex-1">
				<ScoreBreakdown factors={breakdown.factors} totalScore={breakdown.score} />
			</div>
		</div>
	);
}

export default function ScoresPage(): React.ReactElement {
	const { data: agents, loading, isDemo } = useAgents();
	const [lookupAddress, setLookupAddress] = useState("");
	const [activeAddress, setActiveAddress] = useState("");

	function handleLookup(): void {
		const trimmed = lookupAddress.trim();
		if (trimmed.length > 0) {
			setActiveAddress(trimmed);
		}
	}

	if (loading || !agents) {
		return (
			<AppLayout>
				<div className="space-y-6">
					<div className="h-12 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
					<div className="h-64 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]" />
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout isDemo={isDemo}>
			{/* Score Lookup */}
			<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
				<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">Score Lookup</h2>
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
						/>
						<input
							type="text"
							value={lookupAddress}
							onChange={(e) => setLookupAddress(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleLookup();
							}}
							placeholder="Enter agent address (0x...)"
							className="w-full rounded-md border border-[hsl(var(--border))] bg-transparent py-2 pl-10 pr-4 font-mono text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--ring))] focus:outline-none"
						/>
					</div>
					<button
						type="button"
						onClick={handleLookup}
						className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity cursor-pointer"
					>
						Lookup
					</button>
				</div>

				{/* Breakdown result */}
				{activeAddress && (
					<div className="mt-6">
						<BreakdownPanel address={activeAddress} />
					</div>
				)}
			</div>

			{/* Distribution Chart */}
			<div className="mt-6 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
				<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">
					Score Distribution
				</h2>
				<ScoreDistribution agents={agents} />
			</div>

			{/* Leaderboard */}
			<div className="mt-6 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
				<h2 className="mb-4 text-sm font-medium text-[hsl(var(--foreground))]">Leaderboard</h2>
				<div className="space-y-2">
					{agents
						.slice()
						.sort((a, b) => b.score - a.score)
						.map((agent, idx) => (
							<Link
								key={agent.agent}
								href={`/agents/${agent.agent}`}
								className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[hsl(var(--accent))]"
							>
								<span className="w-6 text-center font-mono text-xs font-bold text-[hsl(var(--muted-foreground))]">
									#{idx + 1}
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
		</AppLayout>
	);
}
