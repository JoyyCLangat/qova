/**
 * Scoring algorithm wrapper -- identical to CRE shared/scoring.ts.
 * Canonical source: cre/shared/scoring.ts
 *
 * Re-implemented here because cre/ is not a workspace dependency of api/.
 * Any changes to the scoring algorithm MUST be synced between both files.
 *
 * @author Qova Engineering <eng@qova.cc>
 */

/** Score weights -- must match cre/shared/constants.ts SCORE_WEIGHTS */
const SCORE_WEIGHTS = {
	transactionVolume: 0.25,
	transactionCount: 0.2,
	successRate: 0.3,
	budgetCompliance: 0.15,
	accountAge: 0.1,
} as const;

const MIN_SCORE = 0;
const MAX_SCORE = 1000;

/** Raw agent metrics from on-chain + off-chain sources. */
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
 * @param metrics - Raw agent metrics from on-chain + off-chain sources.
 * @returns Score in range [0, 1000].
 */
export function computeReputationScore(metrics: AgentMetrics): number {
	if (!metrics.sanctionsClean) return MIN_SCORE;

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

/** Normalization helpers -- identical to cre/shared/scoring.ts */

function normalizeVolume(volume: bigint): number {
	const ethValue = Number(volume) / 1e18;
	if (ethValue <= 0) return 0;
	return Math.min(1, Math.log10(ethValue + 1) / 2);
}

function normalizeCount(count: number): number {
	return Math.min(1, count / 1000);
}

function normalizeSuccessRate(basisPoints: number): number {
	return basisPoints / 10000;
}

function normalizeBudgetCompliance(spent: bigint, limit: bigint): number {
	if (limit === 0n) return 1.0;
	const ratio = Number(spent) / Number(limit);
	if (ratio <= 0.8) return 1.0;
	if (ratio <= 1.0) return 0.7;
	return Math.max(0, 1 - (ratio - 1));
}

function normalizeAccountAge(seconds: number): number {
	const days = seconds / 86400;
	return Math.min(1, days / 365);
}

export { SCORE_WEIGHTS, MIN_SCORE, MAX_SCORE };
