/**
 * @file shared/scoring.ts
 * Reputation scoring algorithm -- pure deterministic computation.
 * Runs on every CRE node independently; results aggregated via BFT consensus.
 */

import { MAX_SCORE, MIN_SCORE, SCORE_WEIGHTS } from "./constants";

/** Raw agent metrics from on-chain + off-chain sources */
export interface AgentMetrics {
	totalVolume: bigint;
	transactionCount: number;
	successRate: number; // basis points (0-10000)
	dailySpent: bigint;
	dailyLimit: bigint;
	accountAgeSeconds: number;
	sanctionsClean: boolean;
	apiReputationScore?: number; // 0-100 from external API
}

/**
 * Compute a reputation score from raw agent metrics.
 * @param metrics Raw agent metrics from on-chain + off-chain sources.
 * @returns Score in range [0, 1000].
 */
export function computeReputationScore(metrics: AgentMetrics): number {
	// Sanctions flag is a hard gate -- flagged agents get score 0
	if (!metrics.sanctionsClean) return MIN_SCORE;

	// No activity at all -- insufficient data for a meaningful score
	if (
		metrics.totalVolume === 0n &&
		metrics.transactionCount === 0 &&
		metrics.accountAgeSeconds === 0
	) {
		return MIN_SCORE;
	}

	const volumeScore = normalizeVolume(metrics.totalVolume);
	const countScore = normalizeCount(metrics.transactionCount);
	const successScore = normalizeSuccessRate(metrics.successRate);
	const budgetScore = normalizeBudgetCompliance(metrics.dailySpent, metrics.dailyLimit);
	const ageScore = normalizeAccountAge(metrics.accountAgeSeconds);

	const weighted =
		volumeScore * SCORE_WEIGHTS.transactionVolume +
		countScore * SCORE_WEIGHTS.transactionCount +
		successScore * SCORE_WEIGHTS.successRate +
		budgetScore * SCORE_WEIGHTS.budgetCompliance +
		ageScore * SCORE_WEIGHTS.accountAge;

	return Math.round(Math.max(MIN_SCORE, Math.min(MAX_SCORE, weighted * MAX_SCORE)));
}

/** 0 ETH = 0.0, 100+ ETH = 1.0, logarithmic scale */
function normalizeVolume(volume: bigint): number {
	const ethValue = Number(volume) / 1e18;
	if (ethValue <= 0) return 0;
	return Math.min(1, Math.log10(ethValue + 1) / 2);
}

/** 0 txs = 0.0, 1000+ txs = 1.0 */
function normalizeCount(count: number): number {
	return Math.min(1, count / 1000);
}

/** Direct mapping: 10000 bps = 1.0 */
function normalizeSuccessRate(basisPoints: number): number {
	return basisPoints / 10000;
}

/** Under 80% = perfect, 80-100% = caution, over limit = penalized */
function normalizeBudgetCompliance(spent: bigint, limit: bigint): number {
	if (limit === 0n) return 1.0;
	const ratio = Number(spent) / Number(limit);
	if (ratio <= 0.8) return 1.0;
	if (ratio <= 1.0) return 0.7;
	return Math.max(0, 1 - (ratio - 1));
}

/** 0 days = 0.0, 365+ days = 1.0 */
function normalizeAccountAge(seconds: number): number {
	const days = seconds / 86400;
	return Math.min(1, days / 365);
}
