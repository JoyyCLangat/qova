/**
 * Zod schemas for API response shapes (for documentation/validation).
 * @author Qova Engineering <eng@qova.cc>
 */

import { z } from "zod";

export const AgentResponse = z.object({
	agent: z.string(),
	score: z.number(),
	grade: z.string(),
	gradeColor: z.string(),
	scoreFormatted: z.string(),
	scorePercentage: z.number(),
	lastUpdated: z.string(),
	updateCount: z.number(),
	isRegistered: z.boolean(),
	addressShort: z.string(),
	explorerUrl: z.string(),
});

export const ScoreResponse = z.object({
	agent: z.string(),
	score: z.number(),
	grade: z.string(),
	gradeColor: z.string(),
});

export const TransactionStatsResponse = z.object({
	agent: z.string(),
	totalCount: z.number(),
	totalVolume: z.string(),
	totalVolumeWei: z.string(),
	successRate: z.string(),
	successRateBps: z.number(),
	lastActivity: z.string(),
	addressShort: z.string(),
});

export const BudgetStatusResponse = z.object({
	agent: z.string(),
	config: z.object({
		dailyLimit: z.string(),
		monthlyLimit: z.string(),
		perTxLimit: z.string(),
	}),
	usage: z.object({
		dailySpent: z.string(),
		monthlySpent: z.string(),
		dailyRemaining: z.string(),
		monthlyRemaining: z.string(),
	}),
	utilization: z.object({
		daily: z.string(),
		monthly: z.string(),
	}),
	raw: z.record(z.string()),
});

export const HealthResponse = z.object({
	status: z.enum(["ok", "degraded"]),
	timestamp: z.string(),
	chain: z.string(),
	chainId: z.number(),
	contracts: z.record(
		z.object({
			address: z.string(),
			accessible: z.boolean(),
		}),
	),
	sdk: z.object({ version: z.string() }),
	api: z.object({ version: z.string() }),
});

export const VerifyResponse = z.object({
	agent: z.string(),
	verified: z.boolean(),
	score: z.number(),
	grade: z.string(),
	sanctionsClean: z.boolean(),
	isRegistered: z.boolean(),
	timestamp: z.string(),
});
