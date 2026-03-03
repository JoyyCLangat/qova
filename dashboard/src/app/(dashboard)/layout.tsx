import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { SiteHeader } from "@/components/site-header";
import { WalletSync } from "@/components/wallet-sync";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChainProvider } from "@/components/providers/chain-provider";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<ChainProvider>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 52)",
						"--header-height": "calc(var(--spacing) * 12)",
					} as React.CSSProperties
				}
			>
				<AppSidebar variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col">
						<div className="@container/main flex flex-1 flex-col gap-2">
							{children}
						</div>
					</div>
				</SidebarInset>
				<CommandPalette />
				<WalletSync />
			</SidebarProvider>
		</ChainProvider>
	);
}
