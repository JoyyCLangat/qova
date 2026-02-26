"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const PAGE_LABELS: Record<string, string> = {
	"/": "Overview",
	"/agents": "Agents",
	"/scores": "Scores",
	"/transactions": "Transactions",
	"/verify": "Verify",
};

interface HeaderProps {
	isDemo?: boolean;
}

function getPageName(pathname: string): string {
	if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];

	// Try matching the first segment for nested routes
	const base = `/${pathname.split("/").filter(Boolean)[0] ?? ""}`;
	return PAGE_LABELS[base] ?? "Dashboard";
}

export function Header({ isDemo }: HeaderProps): React.ReactElement {
	const pathname = usePathname();
	const pageName = getPageName(pathname);

	return (
		<header
			className={cn(
				"sticky top-0 z-20 flex h-14 items-center justify-between",
				"border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6",
			)}
		>
			{/* Breadcrumb */}
			<span className="text-sm font-medium text-[hsl(var(--foreground))]">{pageName}</span>

			{/* Right section */}
			<div className="flex items-center gap-3">
				{/* Chain badge */}
				<span
					className={cn(
						"inline-flex items-center gap-1.5",
						"rounded-md border border-[hsl(var(--border))] px-2.5 py-1",
						"text-xs font-mono text-[hsl(var(--muted-foreground))]",
					)}
				>
					<span className="h-1.5 w-1.5 rounded-full bg-score-green" />
					Base Sepolia
				</span>

				<ThemeToggle />

				{/* Demo indicator */}
				{isDemo && (
					<span
						className={cn(
							"inline-flex items-center",
							"rounded-md border border-[hsl(var(--border))] px-2 py-1",
							"text-[10px] font-medium tracking-wide uppercase",
							"text-[hsl(var(--muted-foreground))]",
						)}
					>
						Demo Data
					</span>
				)}
			</div>
		</header>
	);
}
