"use client";

import {
	ArrowDown,
	ArrowUp,
	ArrowsDownUp,
	CaretLeft,
	CaretRight,
	Columns,
	MagnifyingGlass,
} from "@phosphor-icons/react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	/** Enable global text search filter */
	searchable?: boolean;
	searchPlaceholder?: string;
	/** Function to generate a link for row click navigation */
	getRowHref?: (row: TData) => string;
	/** Show rows-per-page selector */
	showPageSizeSelector?: boolean;
	/** Show column visibility toggle */
	showColumnToggle?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageSize = 10,
	emptyState,
	loading = false,
	compact = false,
	searchable = false,
	searchPlaceholder = "Search...",
	getRowHref,
	showPageSizeSelector = false,
	showColumnToggle = false,
}: DataTableProps<TData, TValue>): React.ReactElement {
	const router = useRouter();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter, columnVisibility },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize },
		},
	});

	const handleRowClick = useCallback(
		(row: TData): void => {
			if (getRowHref) {
				router.push(getRowHref(row));
			}
		},
		[getRowHref, router],
	);

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
	const currentPageSize = table.getState().pagination.pageSize;
	const totalRows = table.getFilteredRowModel().rows.length;
	const start = totalRows === 0 ? 0 : currentPage * currentPageSize + 1;
	const end = Math.min((currentPage + 1) * currentPageSize, totalRows);

	const allColumns = table.getAllColumns().filter((col) => col.getCanHide());

	return (
		<div className="space-y-3">
			{/* Toolbar: search + column toggle */}
			{(searchable || showColumnToggle) && (
				<div className="flex items-center gap-2">
					{searchable && (
						<div className="relative flex-1 max-w-sm">
							<MagnifyingGlass
								size={14}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
							<input
								type="text"
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
								placeholder={searchPlaceholder}
								className="w-full rounded-md border bg-transparent py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
							/>
						</div>
					)}
					{showColumnToggle && allColumns.length > 0 && (
						<div className="relative ml-auto">
							<details className="group">
								<summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors list-none">
									<Columns size={14} />
									Columns
								</summary>
								<div className="absolute right-0 z-10 mt-1 min-w-[160px] rounded-md border bg-card p-2 space-y-1">
									{allColumns.map((column) => (
										<label
											key={column.id}
											className="flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted cursor-pointer"
										>
											<input
												type="checkbox"
												checked={column.getIsVisible()}
												onChange={column.getToggleVisibilityHandler()}
												className="size-3.5 rounded border accent-foreground"
											/>
											<span className="capitalize">
												{typeof column.columnDef.header === "string"
													? column.columnDef.header
													: column.id}
											</span>
										</label>
									))}
								</div>
							</details>
						</div>
					)}
				</div>
			)}

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
								<TableRow
									key={row.id}
									className={cn(getRowHref && "cursor-pointer")}
									onClick={getRowHref ? () => handleRowClick(row.original) : undefined}
								>
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
									{globalFilter ? `No results for "${globalFilter}"` : "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Footer: count + page size + pagination */}
			{(pageCount > 1 || showPageSizeSelector || totalRows > 0) && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<p className="text-sm text-muted-foreground tabular-nums">
							{start}--{end} of {totalRows}
						</p>
						{showPageSizeSelector && (
							<Select
								value={String(currentPageSize)}
								onValueChange={(val) => {
									table.setPageSize(Number(val));
								}}
							>
								<SelectTrigger className="h-8 w-[70px]" size="sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[10, 25, 50].map((size) => (
										<SelectItem key={size} value={String(size)}>
											{size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
					{pageCount > 1 && (
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
					)}
				</div>
			)}
		</div>
	);
}
