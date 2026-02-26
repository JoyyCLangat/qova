/**
 * Formatting utility functions.
 * @author Qova Engineering <eng@qova.cc>
 */

import { formatUnits } from "viem";

/**
 * Format a wei value to a human-readable string.
 * @param value - The value in wei (or smallest unit).
 * @param decimals - Number of decimal places (default 18 for ETH).
 * @returns Formatted string, e.g. "1.5".
 * @example formatWei(1500000000000000000n) // "1.5"
 * @example formatWei(1000000n, 6) // "1.0" (USDC)
 */
export function formatWei(value: bigint, decimals = 18): string {
	return formatUnits(value, decimals);
}

/**
 * Convert a block timestamp (seconds since epoch) to a Date object.
 * @param timestamp - The block timestamp as bigint.
 * @returns JavaScript Date object.
 * @example formatTimestamp(1709000000n) // Date object
 */
export function formatTimestamp(timestamp: bigint): Date {
	return new Date(Number(timestamp) * 1000);
}

/**
 * Format basis points (0-10000) to a percentage string.
 * @param bps - Basis points value.
 * @returns Formatted percentage string, e.g. "97.50%".
 * @example formatBasisPoints(9750) // "97.50%"
 * @example formatBasisPoints(10000) // "100.00%"
 */
export function formatBasisPoints(bps: number): string {
	return `${(bps / 100).toFixed(2)}%`;
}
