/**
 * Budget-related types mirroring BudgetEnforcer contract structs.
 * @author Qova Engineering <eng@qova.cc>
 */

import { z } from "zod";

/** Zod schema for an agent's budget configuration. */
export const BudgetConfigSchema = z.object({
	dailyLimit: z.bigint(),
	monthlyLimit: z.bigint(),
	perTxLimit: z.bigint(),
});

/** Configuration for an agent's spending limits. */
export type BudgetConfig = z.infer<typeof BudgetConfigSchema>;

/** Zod schema for an agent's current budget status with remaining allowances. */
export const BudgetStatusSchema = z.object({
	dailyRemaining: z.bigint(),
	monthlyRemaining: z.bigint(),
	perTxLimit: z.bigint(),
	dailySpent: z.bigint(),
	monthlySpent: z.bigint(),
});

/**
 * Read-only snapshot of an agent's remaining budget allowances.
 * Mirrors BudgetEnforcer.BudgetStatus struct.
 */
export type BudgetStatus = z.infer<typeof BudgetStatusSchema>;
