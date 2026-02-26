/**
 * @file shared/types.ts
 * Zod-validated configuration schemas for CRE workflows.
 */

import { z } from "zod";

/** Reputation Oracle config schema */
export const ReputationOracleConfigSchema = z.object({
	schedule: z.string(),
	evm: z.object({
		chainSelectorName: z.string(),
		reputationRegistry: z.string(),
		transactionValidator: z.string(),
		budgetEnforcer: z.string(),
	}),
	scoringApiUrl: z.string(),
});
export type ReputationOracleConfig = z.infer<typeof ReputationOracleConfigSchema>;

/** Transaction Monitor config schema */
export const TransactionMonitorConfigSchema = z.object({
	evm: z.object({
		chainSelectorName: z.string(),
		transactionValidator: z.string(),
		reputationRegistry: z.string(),
	}),
	scoringApiUrl: z.string(),
	alertWebhookUrl: z.string().optional(),
});
export type TransactionMonitorConfig = z.infer<typeof TransactionMonitorConfigSchema>;

/** Budget Alert config schema */
export const BudgetAlertConfigSchema = z.object({
	evm: z.object({
		chainSelectorName: z.string(),
		budgetEnforcer: z.string(),
	}),
	alertWebhookUrl: z.string(),
});
export type BudgetAlertConfig = z.infer<typeof BudgetAlertConfigSchema>;

/** Agent Verify config schema */
export const AgentVerifyConfigSchema = z.object({
	evm: z.object({
		chainSelectorName: z.string(),
		reputationRegistry: z.string(),
		transactionValidator: z.string(),
		budgetEnforcer: z.string(),
	}),
	sanctionsApiUrl: z.string(),
});
export type AgentVerifyConfig = z.infer<typeof AgentVerifyConfigSchema>;

/** Scoring API response shape */
export const ScoringResponseSchema = z.object({
	sanctionsClean: z.boolean(),
	apiReputationScore: z.number().min(0).max(100).optional(),
	riskLevel: z.string(),
	lastChecked: z.number(),
});
export type ScoringResponse = z.infer<typeof ScoringResponseSchema>;
