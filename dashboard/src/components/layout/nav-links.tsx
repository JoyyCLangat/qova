"use client";

import { ArrowLeftRight, BarChart3, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ href: "/", label: "Overview", icon: LayoutDashboard },
	{ href: "/agents", label: "Agents", icon: Users },
	{ href: "/scores", label: "Scores", icon: BarChart3 },
	{ href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
	{ href: "/verify", label: "Verify", icon: ShieldCheck },
] as const;

interface NavLinksProps {
	collapsed: boolean;
}

export function NavLinks({ collapsed }: NavLinksProps): React.ReactElement {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-1 px-2">
			{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
				const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

				return (
					<Link
						key={href}
						href={href}
						title={collapsed ? label : undefined}
						className={cn(
							"flex items-center gap-3 rounded-md text-sm transition-colors",
							collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
							isActive
								? "border-l-2 border-[hsl(var(--primary))] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
								: "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]",
						)}
					>
						<Icon size={18} className="shrink-0" />
						{!collapsed && <span>{label}</span>}
					</Link>
				);
			})}
		</nav>
	);
}
