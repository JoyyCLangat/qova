"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
	children: React.ReactNode;
	isDemo?: boolean;
}

export function AppLayout({ children, isDemo }: AppLayoutProps): React.ReactElement {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="min-h-screen">
			<Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

			<div
				className={cn(
					"flex min-h-screen flex-col transition-all duration-200",
					collapsed ? "ml-16" : "ml-60",
				)}
			>
				<Header isDemo={isDemo} />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
