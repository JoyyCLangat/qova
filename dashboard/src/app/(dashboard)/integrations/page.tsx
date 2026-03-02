"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
	Plugs,
	CheckCircle,
	ArrowRight,
	MagnifyingGlass,
	Link as LinkIcon,
	ShieldCheck,
	Wallet,
	ChartLineUp,
	Bell,
	Database,
	Globe,
	CurrencyCircleDollar,
	Robot,
	Lightning,
	Code,
	ChartBar,
	Power,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type IntegrationCategory =
	| "blockchain"
	| "oracle"
	| "payment"
	| "notification"
	| "data"
	| "analytics";

interface IntegrationDef {
	id: string;
	name: string;
	description: string;
	category: IntegrationCategory;
	icon: React.ComponentType<{
		className?: string;
		weight?: "fill" | "regular" | "duotone";
	}>;
	coreService?: boolean; // Always "connected", not toggleable
	configFields?: { label: string; placeholder: string; key: string }[];
}

const CATEGORY_CONFIG: Record<
	IntegrationCategory,
	{ label: string; color: string }
> = {
	blockchain: { label: "Blockchain", color: "text-chart-2" },
	oracle: { label: "Oracle", color: "text-score-yellow" },
	payment: { label: "Payment", color: "text-score-green" },
	notification: { label: "Notification", color: "text-muted-foreground" },
	data: { label: "Data", color: "text-chart-2" },
	analytics: { label: "Analytics", color: "text-score-yellow" },
};

const INTEGRATIONS: IntegrationDef[] = [
	{
		id: "base-rpc",
		name: "Base L2 RPC",
		description:
			"Connect to Base network for on-chain agent data, transaction monitoring, and score verification.",
		category: "blockchain",
		icon: LinkIcon,
		coreService: true,
	},
	{
		id: "base-sepolia",
		name: "Base Sepolia (Testnet)",
		description:
			"Testnet RPC endpoint for development and testing of agent scoring workflows.",
		category: "blockchain",
		icon: LinkIcon,
		coreService: true,
	},
	{
		id: "chainlink-cre",
		name: "Chainlink CRE",
		description:
			"Decentralized oracle network for executing credit risk evaluation workflows on-chain.",
		category: "oracle",
		icon: ChartLineUp,
		coreService: true,
	},
	{
		id: "x402",
		name: "x402 Protocol",
		description:
			"HTTP-native payment protocol for monitoring agent payment flows and transaction authorization.",
		category: "payment",
		icon: CurrencyCircleDollar,
		coreService: true,
	},
	{
		id: "convex",
		name: "Convex",
		description:
			"Real-time database for agent data, scores, activity logs, and dashboard state management.",
		category: "data",
		icon: Database,
		coreService: true,
	},
	{
		id: "clerk",
		name: "Clerk Auth",
		description:
			"Authentication and identity management with Sign In With Ethereum (SIWE) support.",
		category: "data",
		icon: ShieldCheck,
		coreService: true,
	},
	{
		id: "coinbase-wallet",
		name: "Coinbase Wallet",
		description:
			"Connect Coinbase wallets for agent wallet management and USDC transaction monitoring.",
		category: "payment",
		icon: Wallet,
		configFields: [
			{
				label: "API Key",
				placeholder: "cb_api_xxxxx",
				key: "apiKey",
			},
		],
	},
	{
		id: "slack",
		name: "Slack",
		description:
			"Send score change alerts, budget warnings, and verification results to Slack channels.",
		category: "notification",
		icon: Bell,
		configFields: [
			{
				label: "Webhook URL",
				placeholder: "https://hooks.slack.com/services/...",
				key: "webhookUrl",
			},
			{
				label: "Channel",
				placeholder: "#qova-alerts",
				key: "channel",
			},
		],
	},
	{
		id: "telegram",
		name: "Telegram Bot",
		description:
			"Receive real-time notifications and query agent scores via a Telegram bot.",
		category: "notification",
		icon: Globe,
		configFields: [
			{
				label: "Bot Token",
				placeholder: "123456:ABC-DEF...",
				key: "botToken",
			},
			{
				label: "Chat ID",
				placeholder: "-1001234567890",
				key: "chatId",
			},
		],
	},
	{
		id: "openai-agents",
		name: "OpenAI Agents SDK",
		description:
			"Integrate Qova trust scores into OpenAI agent decision-making pipelines.",
		category: "analytics",
		icon: Robot,
		configFields: [
			{
				label: "API Key",
				placeholder: "sk-xxxxx",
				key: "apiKey",
			},
		],
	},
	{
		id: "langchain",
		name: "LangChain",
		description:
			"Use Qova as a tool in LangChain agent chains for trust-gated operations.",
		category: "analytics",
		icon: Lightning,
	},
	{
		id: "vercel-ai-sdk",
		name: "Vercel AI SDK",
		description:
			"Embed Qova credit checks in Vercel AI SDK tool calls and agent workflows.",
		category: "analytics",
		icon: Code,
	},
	{
		id: "dune-analytics",
		name: "Dune Analytics",
		description:
			"Export agent score data and CRE execution metrics to Dune dashboards.",
		category: "analytics",
		icon: ChartBar,
	},
];

type DisplayStatus = "connected" | "available" | "coming_soon";

const STATUS_CONFIG: Record<
	DisplayStatus,
	{ label: string; class: string }
> = {
	connected: {
		label: "Connected",
		class: "bg-score-green/10 text-score-green border-score-green/20",
	},
	available: {
		label: "Available",
		class: "bg-chart-2/10 text-chart-2 border-chart-2/20",
	},
	coming_soon: {
		label: "Coming Soon",
		class: "bg-muted text-muted-foreground",
	},
};

export default function IntegrationsPage(): React.ReactElement {
	const connectedIntegrations = useQuery(api.integrationConfigs.list);
	const connectMutation = useMutation(api.integrationConfigs.connect);
	const disconnectMutation = useMutation(api.integrationConfigs.disconnect);

	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [configOpen, setConfigOpen] = useState<string | null>(null);
	const [configValues, setConfigValues] = useState<Record<string, string>>(
		{},
	);
	const [connecting, setConnecting] = useState(false);

	// Build a set of connected integration IDs from Convex
	const connectedSet = useMemo(() => {
		const set = new Set<string>();
		if (connectedIntegrations) {
			for (const ci of connectedIntegrations) {
				if (ci.isActive) set.add(ci.type);
			}
		}
		return set;
	}, [connectedIntegrations]);

	function getStatus(def: IntegrationDef): DisplayStatus {
		if (def.coreService) return "connected";
		if (connectedSet.has(def.id)) return "connected";
		if (def.configFields) return "available";
		return "coming_soon";
	}

	const connectedCount = INTEGRATIONS.filter(
		(i) => getStatus(i) === "connected",
	).length;

	const filtered = INTEGRATIONS.filter((i) => {
		const matchesSearch =
			search.length === 0 ||
			i.name.toLowerCase().includes(search.toLowerCase()) ||
			i.description.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || i.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	const selectedIntegration = configOpen
		? INTEGRATIONS.find((i) => i.id === configOpen)
		: null;
	const selectedIsConnected = selectedIntegration
		? connectedSet.has(selectedIntegration.id)
		: false;

	async function handleConnect(): Promise<void> {
		if (!selectedIntegration) return;
		setConnecting(true);
		try {
			await connectMutation({
				integrationId: selectedIntegration.id,
				name: selectedIntegration.name,
				config: JSON.stringify(configValues),
			});
			toast.success(`${selectedIntegration.name} connected`);
			setConfigOpen(null);
			setConfigValues({});
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to connect",
			);
		} finally {
			setConnecting(false);
		}
	}

	async function handleDisconnect(): Promise<void> {
		if (!selectedIntegration) return;
		setConnecting(true);
		try {
			await disconnectMutation({
				integrationId: selectedIntegration.id,
			});
			toast.success(`${selectedIntegration.name} disconnected`);
			setConfigOpen(null);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to disconnect",
			);
		} finally {
			setConnecting(false);
		}
	}

	return (
		<div className="flex flex-col gap-6 py-4 md:py-6">
			<div className="px-4 lg:px-6">
				<PageHeader
					breadcrumb="Operations"
					title="Integrations"
					subtitle={`${connectedCount} connected -- Connect Qova with your existing tools`}
				/>
			</div>

			{/* Search + Filters */}
			<div className="px-4 lg:px-6 space-y-3">
				<div className="relative max-w-sm">
					<MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search integrations..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					{[
						{ key: "all", label: "All" },
						{ key: "blockchain", label: "Blockchain" },
						{ key: "oracle", label: "Oracle" },
						{ key: "payment", label: "Payment" },
						{ key: "notification", label: "Notification" },
						{ key: "data", label: "Data" },
						{ key: "analytics", label: "Analytics" },
					].map((f) => (
						<button
							key={f.key}
							type="button"
							onClick={() => setCategoryFilter(f.key)}
							className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
								categoryFilter === f.key
									? "bg-foreground text-background"
									: "hover:bg-accent text-muted-foreground"
							}`}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			{/* Integration Grid */}
			<div className="px-4 lg:px-6">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((integration) => {
						const Icon = integration.icon;
						const status = getStatus(integration);
						const statusCfg = STATUS_CONFIG[status];
						const catCfg = CATEGORY_CONFIG[integration.category];
						return (
							<Card key={integration.id} className="group relative">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`rounded-lg border p-2 ${
													status === "connected"
														? "bg-score-green/5 border-score-green/20"
														: "bg-muted"
												}`}
											>
												<Icon
													className={`size-4 ${
														status === "connected"
															? "text-score-green"
															: catCfg.color
													}`}
												/>
											</div>
											<div>
												<CardTitle className="text-sm">
													{integration.name}
												</CardTitle>
												<Badge
													variant="outline"
													className={`text-[10px] mt-1 ${statusCfg.class}`}
												>
													{status === "connected" && (
														<CheckCircle
															className="size-3 mr-0.5"
															weight="fill"
														/>
													)}
													{statusCfg.label}
												</Badge>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pb-4">
									<CardDescription className="text-xs line-clamp-2 mb-3">
										{integration.description}
									</CardDescription>
									<div className="flex items-center justify-between">
										<span
											className={`text-[10px] font-medium ${catCfg.color}`}
										>
											{catCfg.label}
										</span>
										{status === "connected" && !integration.coreService ? (
											<Button
												variant="ghost"
												size="sm"
												className="h-7 text-xs"
												onClick={() => setConfigOpen(integration.id)}
											>
												Configure
												<ArrowRight className="size-3 ml-1" />
											</Button>
										) : status === "connected" && integration.coreService ? (
											<span className="text-[10px] text-score-green font-medium">
												Core service
											</span>
										) : status === "available" ? (
											<Button
												variant="outline"
												size="sm"
												className="h-7 text-xs"
												onClick={() => setConfigOpen(integration.id)}
											>
												Connect
											</Button>
										) : (
											<span className="text-[10px] text-muted-foreground">
												Coming soon
											</span>
										)}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{filtered.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<Plugs className="size-8 text-muted-foreground mb-2" />
						<p className="text-sm font-medium">No integrations found</p>
						<p className="text-xs text-muted-foreground">
							Try adjusting your search or filter.
						</p>
					</div>
				)}
			</div>

			{/* Config Dialog */}
			<Dialog
				open={!!configOpen}
				onOpenChange={(v) => {
					if (!v) {
						setConfigOpen(null);
						setConfigValues({});
					}
				}}
			>
				{selectedIntegration && (
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<selectedIntegration.icon className="size-5" />
								{selectedIntegration.name}
							</DialogTitle>
							<DialogDescription>
								{selectedIntegration.description}
							</DialogDescription>
						</DialogHeader>
						{selectedIntegration.configFields ? (
							<div className="space-y-4 py-2">
								{selectedIntegration.configFields.map((field) => (
									<div key={field.key} className="space-y-2">
										<Label>{field.label}</Label>
										<Input
											placeholder={field.placeholder}
											value={configValues[field.key] ?? ""}
											onChange={(e) =>
												setConfigValues((prev) => ({
													...prev,
													[field.key]: e.target.value,
												}))
											}
										/>
									</div>
								))}
							</div>
						) : (
							<div className="py-4 text-center text-sm text-muted-foreground">
								This integration is automatically configured.
							</div>
						)}
						<DialogFooter>
							{selectedIsConnected && (
								<Button
									variant="outline"
									onClick={handleDisconnect}
									disabled={connecting}
									className="text-destructive hover:text-destructive"
								>
									<Power className="size-4 mr-1" />
									Disconnect
								</Button>
							)}
							<Button
								variant="outline"
								onClick={() => {
									setConfigOpen(null);
									setConfigValues({});
								}}
							>
								Cancel
							</Button>
							{!selectedIsConnected && (
								<Button
									onClick={handleConnect}
									disabled={connecting}
								>
									{connecting ? "Connecting..." : "Connect"}
								</Button>
							)}
							{selectedIsConnected &&
								selectedIntegration.configFields && (
									<Button
										onClick={handleConnect}
										disabled={connecting}
									>
										{connecting ? "Saving..." : "Save"}
									</Button>
								)}
						</DialogFooter>
					</DialogContent>
				)}
			</Dialog>
		</div>
	);
}
