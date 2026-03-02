"use client";

import { ArrowsLeftRight, Plus, Receipt } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { DataTable } from "@/components/data/data-table";
import { EmptyState } from "@/components/data/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAgentList, useRecentActivity } from "@/hooks/use-convex-data";
import { useConvexAvailable } from "@/components/providers/convex-provider";
import { PageHeader } from "@/components/shared/page-header";
import { TX_TYPES } from "@/lib/constants";

function isValidAddress(addr: string): boolean {
	return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function isValidTxHash(hash: string): boolean {
	return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

function timeAgo(ts: number): string {
	const diff = Date.now() - ts;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	return `${days}d ago`;
}

interface TxRow {
	agent: string;
	addressShort: string;
	totalTxCount: number;
	totalVolume: string;
	successRate: string;
	lastActivity: string;
}

const txColumns: ColumnDef<TxRow>[] = [
	{
		accessorKey: "addressShort",
		header: "Agent",
		enableSorting: false,
		cell: ({ row }) => (
			<Link href={`/agents/${row.original.agent}`} className="font-mono text-sm hover:underline">
				{row.original.addressShort}
			</Link>
		),
	},
	{
		accessorKey: "totalTxCount",
		header: "Total Count",
		cell: ({ row }) => (
			<span className="font-mono text-sm tabular-nums">{row.original.totalTxCount}</span>
		),
	},
	{
		accessorKey: "totalVolume",
		header: "Volume",
		enableSorting: false,
		cell: ({ row }) => (
			<span className="font-mono text-sm">{row.original.totalVolume}</span>
		),
	},
	{
		id: "successRate",
		header: "Success Rate",
		enableSorting: false,
		cell: ({ row }) => (
			<Badge variant="outline" className="font-mono tabular-nums">
				{row.original.successRate}
			</Badge>
		),
	},
	{
		accessorKey: "lastActivity",
		header: "Last Activity",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">
				{new Date(row.original.lastActivity).getTime() > 0
					? new Date(row.original.lastActivity).toLocaleDateString()
					: "N/A"}
			</span>
		),
	},
];

export default function TransactionsPage(): React.ReactElement {
	const available = useConvexAvailable();
	const agents = useAgentList();
	const recentActivity = useRecentActivity(20);
	const logActivity = useMutation(api.mutations.activity.logActivity);

	// Form state
	const [agentAddr, setAgentAddr] = useState("");
	const [txHash, setTxHash] = useState("");
	const [amount, setAmount] = useState("");
	const [txType, setTxType] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState(false);

	const txStats: TxRow[] = useMemo(() => {
		return agents
			.filter((a) => (a.totalTxCount ?? 0) > 0)
			.map((a) => ({
				agent: a.address,
				addressShort: a.addressShort,
				totalTxCount: a.totalTxCount ?? 0,
				totalVolume: a.totalVolume ?? "0 ETH",
				successRate: a.successRate ?? "0%",
				lastActivity: a.lastActivity ?? new Date().toISOString(),
			}));
	}, [agents]);

	async function handleSubmit(): Promise<void> {
		setFormError(null);
		setFormSuccess(false);

		const trimmedAgent = agentAddr.trim();
		const trimmedHash = txHash.trim();
		const trimmedAmount = amount.trim();

		if (!trimmedAgent) {
			setFormError("Agent address is required.");
			return;
		}
		if (!isValidAddress(trimmedAgent)) {
			setFormError("Invalid agent address. Must start with 0x and be 42 characters.");
			return;
		}
		if (!trimmedHash) {
			setFormError("Transaction hash is required.");
			return;
		}
		if (!isValidTxHash(trimmedHash)) {
			setFormError("Invalid transaction hash. Must start with 0x and be 66 characters.");
			return;
		}
		if (!trimmedAmount) {
			setFormError("Amount is required.");
			return;
		}
		const amountNum = Number.parseFloat(trimmedAmount);
		if (Number.isNaN(amountNum) || amountNum <= 0) {
			setFormError("Amount must be a positive number.");
			return;
		}

		if (!available) {
			setFormError("Database not configured. Set NEXT_PUBLIC_CONVEX_URL to enable writes.");
			return;
		}

		setSubmitting(true);
		try {
			const txTypeNames = ["Swap", "Transfer", "Stake", "Unstake", "Bridge", "Approve", "Mint", "Burn"];
			const typeName = txTypeNames[txType] ?? "Other";

			await logActivity({
				agent: trimmedAgent,
				type: typeName,
				description: `${typeName} of ${trimmedAmount} ETH`,
				amount: `${trimmedAmount} ETH`,
				txHash: trimmedHash,
			});

			setFormSuccess(true);
			setAgentAddr("");
			setTxHash("");
			setAmount("");
			setTxType(0);
		} catch {
			setFormError("Failed to record transaction.");
		} finally {
			setSubmitting(false);
		}
	}

	useEffect(() => {
		if (formSuccess) {
			const timer = setTimeout(() => setFormSuccess(false), 3000);
			return (): void => {
				clearTimeout(timer);
			};
		}
	}, [formSuccess]);

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
			<PageHeader
				breadcrumb="Operations"
				title="Transactions"
				subtitle="On-chain transaction records across your agents"
			/>

			{/* Record Transaction */}
			<div className="rounded-lg border bg-card p-5">
				<div className="mb-4 flex items-center gap-2">
					<Plus size={18} className="text-foreground" />
					<h2 className="text-sm font-medium text-foreground">Record Transaction</h2>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Agent Address
						</label>
						<input
							type="text"
							value={agentAddr}
							onChange={(e) => {
								setAgentAddr(e.target.value);
								setFormError(null);
							}}
							placeholder="0x..."
							className="w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Transaction Hash
						</label>
						<input
							type="text"
							value={txHash}
							onChange={(e) => {
								setTxHash(e.target.value);
								setFormError(null);
							}}
							placeholder="0x..."
							className="w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Amount (ETH)
						</label>
						<input
							type="text"
							value={amount}
							onChange={(e) => {
								setAmount(e.target.value);
								setFormError(null);
							}}
							placeholder="0.0"
							className="w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Transaction Type
						</label>
						<select
							value={txType}
							onChange={(e) => setTxType(Number(e.target.value))}
							className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:border-ring focus:outline-none"
						>
							{TX_TYPES.map((t) => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}
				{formSuccess && (
					<p className="mt-3 text-sm text-score-green">Transaction recorded successfully.</p>
				)}

				<div className="mt-4">
					<Button
						onClick={handleSubmit}
						disabled={submitting}
					>
						{submitting ? "Submitting..." : "Record"}
					</Button>
				</div>
			</div>

			{/* Agent Transaction Stats */}
			<div className="rounded-lg border bg-card p-5">
				<div className="mb-4 flex items-center gap-2">
					<Receipt size={18} className="text-foreground" />
					<h2 className="text-sm font-medium text-foreground">Agent Transaction Stats</h2>
				</div>

				<DataTable<TxRow, unknown>
					columns={txColumns}
					data={txStats}
					pageSize={10}
					emptyState={
						<EmptyState
							icon={<ArrowsLeftRight size={40} />}
							title="No transaction data"
							description="Record a transaction above to start tracking agent activity."
						/>
					}
				/>
			</div>

			{/* Recent Activity */}
			{recentActivity.length > 0 && (
				<div className="rounded-lg border bg-card p-5">
					<h2 className="mb-4 text-sm font-medium text-foreground">Recent Activity</h2>
					<div className="overflow-hidden rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted hover:bg-muted">
									<TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Agent</TableHead>
									<TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</TableHead>
									<TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</TableHead>
									<TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Amount</TableHead>
									<TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">Time</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentActivity.map((tx) => (
									<TableRow key={tx._id}>
										<TableCell className="px-4 py-3">
											<Link
												href={`/agents/${tx.agent}`}
												className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
											>
												{tx.addressShort}
											</Link>
										</TableCell>
										<TableCell className="px-4 py-3">
											<Badge variant="outline">{tx.type}</Badge>
										</TableCell>
										<TableCell className="px-4 py-3 max-w-[200px]">
											<span className="truncate text-xs text-muted-foreground">
												{tx.description}
											</span>
										</TableCell>
										<TableCell className="px-4 py-3 text-right">
											{tx.amount && <span className="font-mono text-xs">{tx.amount}</span>}
										</TableCell>
										<TableCell className="px-4 py-3 text-right">
											<span className="text-xs text-muted-foreground">
												{timeAgo(tx.timestamp)}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}
		</div>
	);
}
