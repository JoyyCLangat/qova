/**
 * Supported chain registry.
 * Extensible -- add new chains here without touching components.
 */

export interface ChainConfig {
	id: number;
	name: string;
	icon: string;
	explorerUrl: string;
	explorerLabel: string;
	nativeCurrency: { name: string; symbol: string; decimals: number };
	isTestnet: boolean;
	brandColor: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
	{
		id: 8453,
		name: "Base",
		icon: "/chains/base.svg",
		explorerUrl: "https://basescan.org",
		explorerLabel: "Basescan",
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		isTestnet: false,
		brandColor: "#0052FF",
	},
	{
		id: 2046399126,
		name: "SKALE Europa",
		icon: "/chains/skale.svg",
		explorerUrl: "https://elated-tan-skat.explorer.mainnet.skalenodes.com",
		explorerLabel: "SKALE Explorer",
		nativeCurrency: { name: "sFUEL", symbol: "sFUEL", decimals: 18 },
		isTestnet: false,
		brandColor: "#68D391",
	},
] as const;

export const DEFAULT_CHAIN_ID = 8453;

/** Lookup a chain config by ID. Returns undefined if not found. */
export function getChain(chainId: number): ChainConfig | undefined {
	return SUPPORTED_CHAINS.find((c) => c.id === chainId);
}

/** Build a block-explorer address URL for a given chain. */
export function getExplorerUrl(chainId: number, address: string): string {
	const chain = getChain(chainId);
	if (!chain) return `https://basescan.org/address/${address}`;
	return `${chain.explorerUrl}/address/${address}`;
}

/** Build a block-explorer transaction URL for a given chain. */
export function getExplorerTxUrl(chainId: number, txHash: string): string {
	const chain = getChain(chainId);
	if (!chain) return `https://basescan.org/tx/${txHash}`;
	return `${chain.explorerUrl}/tx/${txHash}`;
}
