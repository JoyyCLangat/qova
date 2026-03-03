/**
 * Supported token registry.
 * Keyed by `{chainId}-{symbol}` for fast lookups.
 */

export interface TokenConfig {
	symbol: string;
	name: string;
	decimals: number;
	chainId: number;
	contractAddress: string | null; // null = native currency
	icon: string;
}

export const SUPPORTED_TOKENS: TokenConfig[] = [
	// ─── Base (8453) ────────────────────────────────
	{
		symbol: "ETH",
		name: "Ether",
		decimals: 18,
		chainId: 8453,
		contractAddress: null,
		icon: "/tokens/eth.svg",
	},
	{
		symbol: "USDC",
		name: "USD Coin",
		decimals: 6,
		chainId: 8453,
		contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
		icon: "/tokens/usdc.svg",
	},
	{
		symbol: "USDT",
		name: "Tether USD",
		decimals: 6,
		chainId: 8453,
		contractAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
		icon: "/tokens/usdt.svg",
	},
	// ─── SKALE Europa (2046399126) ──────────────────
	{
		symbol: "sFUEL",
		name: "sFUEL",
		decimals: 18,
		chainId: 2046399126,
		contractAddress: null,
		icon: "/tokens/sfuel.svg",
	},
	{
		symbol: "SKL",
		name: "SKALE",
		decimals: 18,
		chainId: 2046399126,
		contractAddress: "0xE0595a049d02b7674572b0d59cd4880Db60EDC50",
		icon: "/tokens/skl.svg",
	},
	{
		symbol: "USDC",
		name: "USD Coin",
		decimals: 6,
		chainId: 2046399126,
		contractAddress: "0x7Cf76E740Cb23b99337b21F392F22c47Ad264c64",
		icon: "/tokens/usdc.svg",
	},
];

/** Get all tokens available on a specific chain. */
export function getTokensForChain(chainId: number): TokenConfig[] {
	return SUPPORTED_TOKENS.filter((t) => t.chainId === chainId);
}

/** Get a specific token by chain + symbol. */
export function getToken(chainId: number, symbol: string): TokenConfig | undefined {
	return SUPPORTED_TOKENS.find(
		(t) => t.chainId === chainId && t.symbol === symbol,
	);
}

/** Format a raw token amount (bigint-string or number) for display. */
export function formatTokenAmount(
	amount: bigint | string | number,
	symbol: string,
	decimals = 18,
): string {
	let raw: bigint;
	if (typeof amount === "bigint") {
		raw = amount;
	} else if (typeof amount === "string") {
		// Could be a float string like "1.5" or a wei string like "1500000000000000000"
		if (amount.includes(".")) {
			return `${amount} ${symbol}`;
		}
		raw = BigInt(amount);
	} else {
		// Already a JS number (display value)
		return `${amount} ${symbol}`;
	}

	const divisor = BigInt(10) ** BigInt(decimals);
	const whole = raw / divisor;
	const remainder = raw % divisor;
	const absRemainder = remainder < BigInt(0) ? -remainder : remainder;
	const decimalStr = String(absRemainder)
		.padStart(decimals, "0")
		.slice(0, 4);
	const formatted = `${whole}.${decimalStr}`.replace(/\.?0+$/, "");
	return `${formatted || "0"} ${symbol}`;
}
