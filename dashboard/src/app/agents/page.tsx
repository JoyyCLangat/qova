"use client";

import { ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ScoreBadge } from "@/components/scores/score-badge";
import { useAgents } from "@/hooks/use-agents";
import { timeAgo } from "@/lib/constants";

type SortKey = "score" | "grade" | "lastUpdated" | "updateCount";
type SortDir = "asc" | "desc";

export default function AgentsPage(): React.ReactElement {
	const { data: agents, loading, isDemo } = useAgents();
	const [sortKey, setSortKey] = useState<SortKey>("score");
	const [sortDir, setSortDir] = useState<SortDir>("desc");

	const sorted = useMemo(() => {
		if (!agents) return [];
		return [...agents].sort((a, b) => {
			let cmp = 0;
			switch (sortKey) {
				case "score":
					cmp = a.score - b.score;
					break;
				case "grade":
					cmp = a.score - b.score;
					break;
				case "lastUpdated":
					cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
					break;
				case "updateCount":
					cmp = a.updateCount - b.updateCount;
					break;
			}
			return sortDir === "desc" ? -cmp : cmp;
		});
	}, [agents, sortKey, sortDir]);

	function toggleSort(key: SortKey): void {
		if (sortKey === key) {
			setSortDir((d) => (d === "desc" ? "asc" : "desc"));
		} else {
			setSortKey(key);
			setSortDir("desc");
		}
	}

	if (loading || !agents) {
		return (
			<AppLayout>
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className="h-14 animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
						/>
					))}
				</div>
			</AppLayout>
		);
	}

	return (
		<AppLayout isDemo={isDemo}>
			<div className="mb-4 flex items-center justify-between">
				<h1 className="font-heading text-lg font-semibold text-[hsl(var(--foreground))]">
					Registered Agents
				</h1>
				<span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
					{agents.length} total
				</span>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
							<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
								Agent
							</th>
							<SortHeader
								label="Score"
								sortKey="score"
								active={sortKey}
								dir={sortDir}
								onSort={toggleSort}
							/>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
								Grade
							</th>
							<SortHeader
								label="Updates"
								sortKey="updateCount"
								active={sortKey}
								dir={sortDir}
								onSort={toggleSort}
							/>
							<SortHeader
								label="Last Updated"
								sortKey="lastUpdated"
								active={sortKey}
								dir={sortDir}
								onSort={toggleSort}
							/>
							<th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
								Explorer
							</th>
						</tr>
					</thead>
					<tbody>
						{sorted.map((agent) => (
							<tr
								key={agent.agent}
								className="border-b border-[hsl(var(--border))] last:border-b-0 transition-colors hover:bg-[hsl(var(--accent))]"
							>
								<td className="px-4 py-3">
									<Link
										href={`/agents/${agent.agent}`}
										className="font-mono text-sm text-[hsl(var(--foreground))] hover:underline"
									>
										{agent.addressShort}
									</Link>
								</td>
								<td className="px-4 py-3 font-mono text-sm text-[hsl(var(--foreground))]">
									{agent.score}
								</td>
								<td className="px-4 py-3">
									<ScoreBadge grade={agent.grade} size="xs" />
								</td>
								<td className="px-4 py-3 font-mono text-sm text-[hsl(var(--muted-foreground))]">
									{agent.updateCount}
								</td>
								<td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">
									{timeAgo(agent.lastUpdated)}
								</td>
								<td className="px-4 py-3 text-right">
									<a
										href={agent.explorerUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
									>
										<ExternalLink size={14} />
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</AppLayout>
	);
}

function SortHeader({
	label,
	sortKey,
	active,
	dir,
	onSort,
}: {
	label: string;
	sortKey: SortKey;
	active: SortKey;
	dir: SortDir;
	onSort: (key: SortKey) => void;
}): React.ReactElement {
	const isActive = sortKey === active;
	return (
		<th className="px-4 py-3 text-left">
			<button
				type="button"
				onClick={() => onSort(sortKey)}
				className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
			>
				{label}
				<ArrowUpDown
					size={12}
					className={isActive ? "text-[hsl(var(--foreground))]" : "opacity-40"}
				/>
				{isActive && <span className="text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>}
			</button>
		</th>
	);
}
