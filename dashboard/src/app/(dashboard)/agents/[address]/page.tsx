"use client";

import {
	ArrowSquareOut,
	Check,
	ClockCounterClockwise,
	Copy,
	CurrencyEth,
	Lightning,
	Percent,
	ShieldCheck,
	SpinnerGap,
} from "@phosphor-icons/react";
import { useAction } from "convex/react";
import Link from "next/link";
import { use, useCallback, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { BudgetUsage } from "@/components/charts/budget-usage";
import { StatCard } from "@/components/data/stat-card";
import { ScoreBadge } from "@/components/scores/score-badge";
import { ScoreRing } from "@/components/scores/score-ring";
import { StatusBadge } from "@/components/data/status-badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAgentByAddress, useScoreHistory } from "@/hooks/use-convex-data";
import { useConvexAvailable } from "@/components/providers/convex-provider";
import { cn } from "@/lib/utils";

function timeAgo(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	return `${days}d ago`;
}

function CopyButton({ text }: { text: string }): React.ReactElement {
	const [copied, setCopied] = useState(false);

	function handleCopy(): void {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}

	return (
		<Button
			variant="ghost"
			size="icon-xs"
			onClick={handleCopy}
			aria-label="Copy address"
		>
			{copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
		</Button>
	);
}

function VerifyButton({ address }: { address: string }): React.ReactElement {
	const available = useConvexAvailable();
	const verifyAction = useAction(api.actions.chain.verifyAgent);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{ verified: boolean; score: number } | null>(null);

	const handleVerify = useCallback(async (): Promise<void> => {
		if (!available) return;
		setLoading(true);
		try {
			const res = await verifyAction({ agent: address });
			setResult({ verified: res.verified, score: res.score });
		} catch {
			// Action failed (API may be unavailable)
		} finally {
			setLoading(false);
		}
	}, [address, available, verifyAction]);

	if (result) {
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
					result.verified
						? "border-score-green-border text-score-green"
						: "border-score-red-border text-score-red",
				)}
			>
				<ShieldCheck size={14} weight="fill" />
				{result.verified ? "Verified" : "Not Verified"}
			</span>
		);
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleVerify}
			disabled={loading}
		>
			{loading ? (
				<SpinnerGap size={14} className="animate-spin" />
			) : (
				<ShieldCheck size={14} />
			)}
			Verify Agent
		</Button>
	);
}

export default function AgentDetailPage({
	params,
}: {
	params: Promise<{ address: string }>;
}): React.ReactElement {
	const { address } = use(params);
	const agent = useAgentByAddress(address);
	const scoreHistory = useScoreHistory(address, 30);

	if (!agent) {
		return (
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
				<div className="space-y-6">
					<div className="h-60 animate-pulse rounded-lg border bg-muted" />
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="h-28 animate-pulse rounded-lg border bg-muted" />
						))}
					</div>
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="h-64 animate-pulse rounded-lg border bg-muted" />
						<div className="h-64 animate-pulse rounded-lg border bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	const dailyLimit = agent.dailyLimit ?? "0 ETH";
	const monthlyLimit = agent.monthlyLimit ?? "0 ETH";
	const dailySpent = agent.dailySpent ?? "0 ETH";
	const monthlySpent = agent.monthlySpent ?? "0 ETH";
	const perTxLimit = agent.perTxLimit ?? "0 ETH";

	function parseEthValue(val: string): number {
		const match = val.match(/([\d.]+)/);
		return match ? Number.parseFloat(match[1]) : 0;
	}

	const dailyLimitNum = parseEthValue(dailyLimit);
	const dailySpentNum = parseEthValue(dailySpent);
	const monthlyLimitNum = parseEthValue(monthlyLimit);
	const monthlySpentNum = parseEthValue(monthlySpent);
	const dailyPct = dailyLimitNum > 0 ? (dailySpentNum / dailyLimitNum) * 100 : 0;
	const monthlyPct = monthlyLimitNum > 0 ? (monthlySpentNum / monthlyLimitNum) * 100 : 0;

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
			{/* Breadcrumb */}
			<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
				<Link href="/agents" className="hover:text-foreground transition-colors">
					Agents
				</Link>
				<span>/</span>
				<span className="font-mono text-foreground">{agent.addressShort}</span>
			</div>

			{/* Hero */}
			<div className="rounded-lg border bg-card p-6">
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
					<ScoreRing score={agent.score} grade={agent.grade} size={180} />

					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-mono text-sm text-foreground">{agent.address}</span>
							<CopyButton text={agent.address} />
							<a
								href={agent.explorerUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowSquareOut size={14} />
							</a>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<ScoreBadge grade={agent.grade} score={agent.score} showScore size="lg" />
							<StatusBadge status={agent.isRegistered ? "verified" : "unverified"} />
							<span className="text-xs text-muted-foreground">
								Last updated {timeAgo(agent.lastUpdated)}
							</span>
							<span className="text-xs text-muted-foreground">
								{agent.updateCount} updates
							</span>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Score Progress</span>
								<span className="font-mono">{agent.score}/1000</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full transition-all duration-700 ease-out"
									style={{
										width: `${agent.scorePercentage}%`,
										backgroundColor: agent.gradeColor,
									}}
								/>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2 pt-1">
							<VerifyButton address={address} />
							<Button variant="outline" size="sm" asChild>
								<a
									href={agent.explorerUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ArrowSquareOut size={14} />
									View on Explorer
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Transaction Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Transactions"
					value={String(agent.totalTxCount ?? 0)}
					icon={<Lightning size={20} />}
					accentColor="var(--foreground)"
				/>
				<StatCard
					label="Total Volume"
					value={agent.totalVolume ?? "0 ETH"}
					icon={<CurrencyEth size={20} />}
					accentColor="var(--score-green)"
				/>
				<StatCard
					label="Success Rate"
					value={agent.successRate ?? "0%"}
					icon={<Percent size={20} />}
					accentColor="var(--score-yellow)"
				/>
				<StatCard
					label="Last Activity"
					value={agent.lastActivity ? timeAgo(agent.lastActivity) : "N/A"}
					icon={<ClockCounterClockwise size={20} />}
					accentColor="var(--muted-foreground)"
				/>
			</div>

			{/* Details grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Score History */}
				<div className="rounded-lg border bg-card p-5">
					<h2 className="mb-4 text-sm font-medium text-foreground">Score History</h2>
					{scoreHistory.length > 0 ? (
						<div className="overflow-hidden rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow className="bg-muted hover:bg-muted">
										<TableHead className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Grade</TableHead>
										<TableHead className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</TableHead>
										<TableHead className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{scoreHistory.slice(0, 10).map((s) => (
										<TableRow key={s._id}>
											<TableCell className="px-4 py-2.5">
												<ScoreBadge grade={s.grade} size="xs" />
											</TableCell>
											<TableCell className="px-4 py-2.5 font-mono text-sm tabular-nums">
												{s.score}
											</TableCell>
											<TableCell className="px-4 py-2.5 text-right text-xs text-muted-foreground">
												{new Date(s.timestamp).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<p className="text-xs text-muted-foreground">No score history available</p>
					)}
				</div>

				{/* Budget */}
				<div className="rounded-lg border bg-card p-5">
					<h2 className="mb-4 text-sm font-medium text-foreground">Budget Utilization</h2>
					{dailyLimitNum > 0 || monthlyLimitNum > 0 ? (
						<div className="space-y-4">
							<BudgetUsage label="Daily" percentage={dailyPct} used={dailySpent} total={dailyLimit} />
							<BudgetUsage label="Monthly" percentage={monthlyPct} used={monthlySpent} total={monthlyLimit} />
							<div className="border-t pt-3">
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span>Per-transaction limit</span>
									<span className="font-mono">{perTxLimit}</span>
								</div>
							</div>
						</div>
					) : (
						<p className="text-xs text-muted-foreground">No budget data</p>
					)}
				</div>
			</div>
		</div>
	);
}
