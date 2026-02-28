"use client";

import {
	Cloud,
	Gear,
	Key,
	Link as LinkIcon,
	ShieldCheck,
} from "@phosphor-icons/react";
import { useConvexAvailable } from "@/components/providers/convex-provider";
import { StatusBadge } from "@/components/data/status-badge";

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}): React.ReactElement {
	return (
		<div className="flex items-start justify-between gap-4 border-b py-4 last:border-b-0">
			<div className="space-y-1">
				<p className="text-sm font-medium">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}

export default function SettingsPage(): React.ReactElement {
	const convexAvailable = useConvexAvailable();
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "Not configured";
	const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "Not configured";

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
			<div className="mx-auto max-w-3xl w-full space-y-6">
				{/* System Status */}
				<div className="rounded-lg border bg-card p-6">
					<div className="mb-4 flex items-center gap-2">
						<Cloud size={20} className="text-foreground" />
						<h2 className="text-sm font-medium">System Status</h2>
					</div>
					<div>
						<SettingRow
							label="Convex Database"
							description="Real-time database for agent data, scores, and activity"
						>
							<StatusBadge status={convexAvailable ? "active" : "inactive"} />
						</SettingRow>
						<SettingRow
							label="Qova API"
							description="On-chain API for agent registration, scoring, and verification"
						>
							<span className="font-mono text-xs text-muted-foreground">
								{apiUrl === "Not configured" ? "Not configured" : "Configured"}
							</span>
						</SettingRow>
					</div>
				</div>

				{/* Configuration */}
				<div className="rounded-lg border bg-card p-6">
					<div className="mb-4 flex items-center gap-2">
						<Gear size={20} className="text-foreground" />
						<h2 className="text-sm font-medium">Configuration</h2>
					</div>
					<div>
						<SettingRow
							label="NEXT_PUBLIC_CONVEX_URL"
							description="Convex deployment URL for real-time data"
						>
							<code className="rounded border bg-muted px-2 py-1 font-mono text-xs">
								{convexUrl === "Not configured" ? "Not set" : convexUrl.slice(0, 30) + "..."}
							</code>
						</SettingRow>
						<SettingRow
							label="NEXT_PUBLIC_API_URL"
							description="Qova API base URL for on-chain operations"
						>
							<code className="rounded border bg-muted px-2 py-1 font-mono text-xs">
								{apiUrl === "Not configured" ? "Not set" : apiUrl}
							</code>
						</SettingRow>
					</div>
				</div>

				{/* Network */}
				<div className="rounded-lg border bg-card p-6">
					<div className="mb-4 flex items-center gap-2">
						<LinkIcon size={20} className="text-foreground" />
						<h2 className="text-sm font-medium">Network</h2>
					</div>
					<div>
						<SettingRow label="Chain" description="Target blockchain network">
							<span className="font-mono text-xs">Base Sepolia</span>
						</SettingRow>
						<SettingRow label="Explorer" description="Block explorer for transaction verification">
							<a
								href="https://sepolia.basescan.org"
								target="_blank"
								rel="noopener noreferrer"
								className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								sepolia.basescan.org
							</a>
						</SettingRow>
					</div>
				</div>

				{/* Security */}
				<div className="rounded-lg border bg-card p-6">
					<div className="mb-4 flex items-center gap-2">
						<ShieldCheck size={20} className="text-foreground" />
						<h2 className="text-sm font-medium">Security</h2>
					</div>
					<div>
						<SettingRow
							label="API Authentication"
							description="Authentication method for API requests"
						>
							<span className="text-xs text-muted-foreground">Clerk SIWE</span>
						</SettingRow>
						<SettingRow
							label="Score Verification"
							description="On-chain verification of trust scores"
						>
							<span className="text-xs text-muted-foreground">Chainlink CRE</span>
						</SettingRow>
					</div>
				</div>

				{/* API Keys placeholder */}
				<div className="rounded-lg border bg-card p-6">
					<div className="mb-4 flex items-center gap-2">
						<Key size={20} className="text-foreground" />
						<h2 className="text-sm font-medium">API Keys</h2>
					</div>
					<p className="text-sm text-muted-foreground">
						API key management will be available once Clerk authentication is configured.
						Connect your wallet to generate API keys for programmatic access.
					</p>
				</div>
			</div>
		</div>
	);
}
