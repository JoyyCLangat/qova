"use client";

import {
	ArrowSquareOut,
	MagnifyingGlass,
	Plus,
	Robot,
	SpinnerGap,
	X,
} from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { DataTable } from "@/components/data/data-table";
import { EmptyState } from "@/components/data/empty-state";
import { ScoreBadge } from "@/components/scores/score-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAgentList } from "@/hooks/use-convex-data";
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

/* ------------------------------------------------------------------ */
/*  Agent row type                                                     */
/* ------------------------------------------------------------------ */

interface AgentRow {
	address: string;
	addressShort: string;
	score: number;
	grade: string;
	isRegistered: boolean;
	updateCount: number;
	lastUpdated: string;
	explorerUrl: string;
}

/* ------------------------------------------------------------------ */
/*  Register Agent Dialog                                              */
/* ------------------------------------------------------------------ */

function RegisterDialog({
	open,
	onClose,
	onSuccess,
}: {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}): React.ReactElement | null {
	const available = useConvexAvailable();
	const upsertAgent = useMutation(api.mutations.agents.upsertAgent);
	const [address, setAddress] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

	const handleSubmit = useCallback(
		async (e: React.FormEvent): Promise<void> => {
			e.preventDefault();
			if (!isValidAddress) return;

			if (!available) {
				setError("Database not configured. Set NEXT_PUBLIC_CONVEX_URL to enable registration.");
				return;
			}

			setSubmitting(true);
			setError(null);

			try {
				await upsertAgent({
					address,
					score: 0,
					isRegistered: true,
				});

				setAddress("");
				onSuccess();
				onClose();
			} catch (err) {
				setError(err instanceof Error ? err.message : "Registration failed");
			} finally {
				setSubmitting(false);
			}
		},
		[address, isValidAddress, available, upsertAgent, onClose, onSuccess],
	);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>
			<div className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-heading text-lg font-semibold">Register Agent</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
						aria-label="Close dialog"
					>
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<label htmlFor="agent-address" className="mb-2 block text-sm text-muted-foreground">
						Agent Address
					</label>
					<input
						ref={inputRef}
						id="agent-address"
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="0x..."
						autoComplete="off"
						spellCheck={false}
						className={cn(
							"w-full rounded-md border bg-background px-3 py-2",
							"font-mono text-sm",
							"placeholder:text-muted-foreground",
							"focus:outline-none focus:ring-2 focus:ring-ring",
							address.length > 0 && !isValidAddress ? "border-destructive" : "border-border",
						)}
					/>
					{address.length > 0 && !isValidAddress && (
						<p className="mt-1 text-xs text-destructive">
							Enter a valid Ethereum address (0x + 40 hex characters)
						</p>
					)}
					{error && <p className="mt-2 text-xs text-destructive">{error}</p>}
					<div className="mt-5 flex items-center justify-end gap-3">
						<Button type="button" variant="outline" size="sm" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={!isValidAddress || submitting}
						>
							{submitting && <SpinnerGap size={14} className="animate-spin" />}
							Register
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Column Definitions                                                 */
/* ------------------------------------------------------------------ */

const columns: ColumnDef<AgentRow>[] = [
	{
		accessorKey: "addressShort",
		header: "Agent",
		enableSorting: false,
		cell: ({ row }) => (
			<Link href={`/agents/${row.original.address}`} className="font-mono text-sm hover:underline">
				{row.original.addressShort}
			</Link>
		),
	},
	{
		accessorKey: "score",
		header: "Score",
		cell: ({ row }) => (
			<span className="font-mono text-sm tabular-nums">{row.original.score}</span>
		),
	},
	{
		accessorKey: "grade",
		header: "Grade",
		enableSorting: false,
		cell: ({ row }) => <ScoreBadge grade={row.original.grade} size="xs" />,
	},
	{
		id: "status",
		header: "Status",
		enableSorting: false,
		cell: ({ row }) => (
			<StatusBadge status={row.original.isRegistered ? "active" : "pending"} />
		),
	},
	{
		accessorKey: "updateCount",
		header: "Updates",
		cell: ({ row }) => (
			<Badge variant="outline" className="font-mono tabular-nums">
				{row.original.updateCount}
			</Badge>
		),
	},
	{
		accessorKey: "lastUpdated",
		header: "Last Updated",
		cell: ({ row }) => (
			<span className="text-xs text-muted-foreground">{timeAgo(row.original.lastUpdated)}</span>
		),
	},
	{
		id: "explorer",
		header: () => <span className="sr-only">Explorer</span>,
		enableSorting: false,
		cell: ({ row }) => (
			<a
				href={row.original.explorerUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowSquareOut size={14} />
			</a>
		),
	},
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AgentsPage(): React.ReactElement {
	const agents = useAgentList();
	const [search, setSearch] = useState("");
	const [registerOpen, setRegisterOpen] = useState(false);

	const filtered: AgentRow[] = useMemo(() => {
		const rows: AgentRow[] = agents.map((a) => ({
			address: a.address,
			addressShort: a.addressShort,
			score: a.score,
			grade: a.grade,
			isRegistered: a.isRegistered,
			updateCount: a.updateCount,
			lastUpdated: a.lastUpdated,
			explorerUrl: a.explorerUrl,
		}));

		if (!search.trim()) return rows;
		const q = search.toLowerCase();
		return rows.filter(
			(a) =>
				a.address.toLowerCase().includes(q) ||
				a.addressShort.toLowerCase().includes(q) ||
				a.grade.toLowerCase().includes(q),
		);
	}, [agents, search]);

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="font-heading text-lg font-semibold">
					Registered Agents
					<span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
						{agents.length} total
					</span>
				</h2>

				<div className="flex items-center gap-3">
					<div className="relative">
						<MagnifyingGlass
							size={14}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search agents..."
							className="w-56 rounded-md border bg-background pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
					<Button onClick={() => setRegisterOpen(true)}>
						<Plus size={14} weight="bold" />
						Register Agent
					</Button>
				</div>
			</div>

			{/* Table */}
			<DataTable<AgentRow, unknown>
				columns={columns}
				data={filtered}
				pageSize={10}
				emptyState={
					<EmptyState
						icon={<Robot size={40} />}
						title={search ? "No matching agents" : "No agents registered"}
						description={
							search
								? "Try adjusting your search query."
								: "Register your first agent to get started with trust scoring."
						}
						action={!search ? { label: "Register Agent", onClick: () => setRegisterOpen(true) } : undefined}
					/>
				}
			/>

			<RegisterDialog
				open={registerOpen}
				onClose={() => setRegisterOpen(false)}
				onSuccess={() => {}}
			/>
		</div>
	);
}
