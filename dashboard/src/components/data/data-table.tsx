"use client";

import {
	ArrowDown,
	ArrowUp,
	ArrowsDownUp,
	CaretLeft,
	CaretRight,
} from "@phosphor-icons/react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSize?: number;
	emptyState?: React.ReactNode;
	loading?: boolean;
	compact?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageSize = 10,
	emptyState,
	loading = false,
	compact = false,
}: DataTableProps<TData, TValue>): React.ReactElement {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize },
		},
	});

	const cellPadding = compact ? "px-3 py-2" : "px-4 py-3";

	if (loading) {
		return (
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted hover:bg-muted">
							{columns.map((col, i) => (
								<TableHead
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton columns are static
									key={i}
									className={cn(cellPadding, "text-xs font-medium uppercase tracking-wider")}
								>
									<div className="h-3 w-16 animate-pulse rounded bg-muted-foreground/20" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders
							<TableRow key={i}>
								{columns.map((_, j) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells are static placeholders
									<TableCell key={j} className={cellPadding}>
										<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (data.length === 0 && emptyState) {
		return <>{emptyState}</>;
	}

	const pageCount = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex;
	const totalRows = table.getFilteredRowModel().rows.length;
	const start = totalRows === 0 ? 0 : currentPage * pageSize + 1;
	const end = Math.min((currentPage + 1) * pageSize, totalRows);

	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-muted hover:bg-muted">
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={cn(
											cellPadding,
											"text-xs font-medium uppercase tracking-wider text-muted-foreground",
											header.column.getCanSort() && "cursor-pointer select-none",
										)}
										onClick={header.column.getToggleSortingHandler()}
									>
										{header.isPlaceholder ? null : (
											<span className="inline-flex items-center gap-1">
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getCanSort() && (
													<>
														{header.column.getIsSorted() === "desc" ? (
															<ArrowDown size={12} weight="bold" className="text-foreground" />
														) : header.column.getIsSorted() === "asc" ? (
															<ArrowUp size={12} weight="bold" className="text-foreground" />
														) : (
															<ArrowsDownUp size={12} className="opacity-40" />
														)}
													</>
												)}
											</span>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className={cellPadding}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{pageCount > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{start}–{end} of {totalRows}
					</p>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon-xs"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<CaretLeft size={14} />
							<span className="sr-only">Previous page</span>
						</Button>
						<span className="px-2 text-sm font-medium tabular-nums">
							{currentPage + 1} / {pageCount}
						</span>
						<Button
							variant="outline"
							size="icon-xs"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<CaretRight size={14} />
							<span className="sr-only">Next page</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
