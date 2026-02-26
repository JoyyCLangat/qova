/**
 * Zod schemas for all API request bodies and params.
 * @author Qova Engineering <eng@qova.cc>
 */

import { z } from "zod";

const EthAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");
const HexString = z.string().regex(/^0x[a-fA-F0-9]*$/, "Invalid hex string");

export const RegisterAgentRequest = z.object({
	agent: EthAddress,
});

export const UpdateScoreRequest = z.object({
	score: z.number().int().min(0).max(1000),
	reason: HexString.default("0x0000000000000000000000000000000000000000000000000000000000000000"),
});

export const BatchUpdateScoresRequest = z
	.object({
		agents: z.array(EthAddress).min(1).max(50),
		scores: z.array(z.number().int().min(0).max(1000)),
		reasons: z.array(HexString),
	})
	.refine(
		(data) =>
			data.agents.length === data.scores.length && data.scores.length === data.reasons.length,
		"Arrays must have equal length",
	);

export const RecordTransactionRequest = z.object({
	agent: EthAddress,
	txHash: HexString,
	amount: z.string(),
	txType: z.number().int().min(0).max(4),
});

export const SetBudgetRequest = z.object({
	dailyLimit: z.string(),
	monthlyLimit: z.string(),
	perTxLimit: z.string(),
});

export const CheckBudgetRequest = z.object({
	amount: z.string(),
});

export const RecordSpendRequest = z.object({
	amount: z.string(),
});

export const VerifyAgentRequest = z.object({
	agent: EthAddress,
});

export const ComputeScoreRequest = z.object({
	totalVolume: z.string(),
	transactionCount: z.number().int(),
	successRate: z.number().int().min(0).max(10000),
	dailySpent: z.string(),
	dailyLimit: z.string(),
	accountAgeSeconds: z.number().int(),
	sanctionsClean: z.boolean().default(true),
	apiReputationScore: z.number().min(0).max(100).optional(),
});

export const EnrichRequest = z.object({
	agent: EthAddress,
	onchainData: z.record(z.unknown()).optional(),
});

export const AnomalyCheckRequest = z.object({
	agent: EthAddress,
	txHash: HexString,
	amount: z.string(),
	txType: z.number().int(),
});

export const SanctionsCheckRequest = z.object({
	agent: EthAddress,
});
