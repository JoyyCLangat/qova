import { describe, expect, it } from "vitest";
import {
	computeReputationScore,
	type AgentMetrics,
} from "../../src/services/scoring.js";

describe("computeReputationScore (API copy must match CRE)", () => {
	it("returns 0 for sanctioned agent", () => {
		const metrics: AgentMetrics = {
			totalVolume: 100000000000000000000n,
			transactionCount: 500,
			successRate: 9800,
			dailySpent: 1000000000000000000n,
			dailyLimit: 10000000000000000000n,
			accountAgeSeconds: 365 * 86400,
			sanctionsClean: false,
		};
		expect(computeReputationScore(metrics)).toBe(0);
	});

	it("returns 0 for zero-activity agent", () => {
		const metrics: AgentMetrics = {
			totalVolume: 0n,
			transactionCount: 0,
			successRate: 0,
			dailySpent: 0n,
			dailyLimit: 0n,
			accountAgeSeconds: 0,
			sanctionsClean: true,
		};
		expect(computeReputationScore(metrics)).toBe(0);
	});

	it("returns high score for active compliant agent", () => {
		const metrics: AgentMetrics = {
			totalVolume: 100000000000000000000n,
			transactionCount: 500,
			successRate: 9800,
			dailySpent: 1000000000000000000n,
			dailyLimit: 10000000000000000000n,
			accountAgeSeconds: 365 * 86400,
			sanctionsClean: true,
		};
		const score = computeReputationScore(metrics);
		expect(score).toBeGreaterThan(500);
		expect(score).toBeLessThanOrEqual(1000);
	});

	it("clamps score between 0 and 1000", () => {
		const maxMetrics: AgentMetrics = {
			totalVolume: 1000000000000000000000n,
			transactionCount: 10000,
			successRate: 10000,
			dailySpent: 0n,
			dailyLimit: 1000000000000000000000n,
			accountAgeSeconds: 10 * 365 * 86400,
			sanctionsClean: true,
		};
		const score = computeReputationScore(maxMetrics);
		expect(score).toBeLessThanOrEqual(1000);
		expect(score).toBeGreaterThanOrEqual(0);
	});
});
