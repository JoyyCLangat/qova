"use client";

import {
	ArrowSquareOut,
	MagnifyingGlass,
	Plus,
	Robot,
} from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data/data-table";
import { EmptyState } from "@/components/data/empty-state";
import { ScoreBadge } from "@/components/scores/score-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegisterAgentDialog } from "@/components/register-agent-dialog";
import { useAgentList } from "@/hooks/use-convex-data";

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

	// Listen for command palette "Register New Agent" event
	useEffect(() => {
		function handler(): void {
			setRegisterOpen(true);
		}
		window.addEventListener("qova:register-agent", handler);
		return (): void => {
			window.removeEventListener("qova:register-agent", handler);
		};
	}, []);

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
					<RegisterAgentDialog
						open={registerOpen}
						onOpenChange={setRegisterOpen}
					>
						<Button>
							<Plus size={14} weight="bold" />
							Register Agent
						</Button>
					</RegisterAgentDialog>
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
						action={
							!search
								? {
										label: "Register Agent",
										onClick: () => setRegisterOpen(true),
									}
								: undefined
						}
					/>
				}
			/>
		</div>
	);
}
