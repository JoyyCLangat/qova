"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps): React.ReactElement {
	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-30 flex h-screen flex-col",
				"border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-bg))]",
				"transition-all duration-200",
				collapsed ? "w-16" : "w-60",
			)}
		>
			{/* Logo */}
			<div
				className={cn(
					"flex h-14 shrink-0 items-center border-b border-[hsl(var(--sidebar-border))]",
					collapsed ? "justify-center px-2" : "px-4",
				)}
			>
				{collapsed ? (
					<Image
						src="/assets/logo-mark.svg"
						alt="Qova"
						width={32}
						height={32}
						className="h-8 w-auto"
					/>
				) : (
					<Image src="/assets/logo.svg" alt="Qova" width={120} height={32} className="h-8 w-auto" />
				)}
			</div>

			{/* Navigation */}
			<div className="flex-1 overflow-y-auto py-4">
				<NavLinks collapsed={collapsed} />
			</div>

			{/* Collapse toggle */}
			<div
				className={cn(
					"shrink-0 border-t border-[hsl(var(--sidebar-border))] p-3",
					collapsed ? "flex justify-center" : "",
				)}
			>
				<button
					type="button"
					onClick={onToggle}
					className={cn(
						"inline-flex items-center justify-center",
						"rounded-md p-2",
						"text-[hsl(var(--muted-foreground))]",
						"hover:bg-[hsl(var(--accent))]",
						"transition-colors",
					)}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
				</button>
			</div>
		</aside>
	);
}
