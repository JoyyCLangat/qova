/**
 * Transaction-related types mirroring TransactionValidator contract structs.
 * @author Qova Engineering <eng@qova.cc>
 */

import { z } from "zod";

/**
 * Transaction type classification -- mirrors the Solidity enum exactly.
 * Values MUST match the contract: PAYMENT=0, SWAP=1, TRANSFER=2, CONTRACT_CALL=3, BRIDGE=4
 */
export const TransactionType = {
	PAYMENT: 0,
	SWAP: 1,
	TRANSFER: 2,
	CONTRACT_CALL: 3,
	BRIDGE: 4,
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

/** Human-readable labels for transaction types. */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
	[TransactionType.PAYMENT]: "Payment",
	[TransactionType.SWAP]: "Swap",
	[TransactionType.TRANSFER]: "Transfer",
	[TransactionType.CONTRACT_CALL]: "Contract Call",
	[TransactionType.BRIDGE]: "Bridge",
} as const;

/** Zod schema for TransactionType values. */
export const TransactionTypeSchema = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);

/** Zod schema for aggregate transaction statistics. */
export const TransactionStatsSchema = z.object({
	totalCount: z.number().int().min(0),
	totalVolume: z.bigint(),
	successCount: z.number().int().min(0),
	lastActivityTimestamp: z.bigint(),
});

/**
 * Aggregate statistics for a single agent.
 * Mirrors TransactionValidator.TransactionStats struct.
 */
export type TransactionStats = z.infer<typeof TransactionStatsSchema>;
