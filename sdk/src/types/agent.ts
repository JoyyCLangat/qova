/**
 * Agent-related types mirroring ReputationRegistry contract structs.
 * @author Qova Engineering <eng@qova.cc>
 */

import { z } from "zod";

/** Score grades mapped from numeric score ranges. */
export const SCORE_GRADES = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"] as const;

export type ScoreGrade = (typeof SCORE_GRADES)[number];

/** Zod schema for validating an agent's on-chain details. */
export const AgentDetailsSchema = z.object({
	score: z.number().int().min(0).max(1000),
	lastUpdated: z.bigint(),
	updateCount: z.number().int().min(0),
	isRegistered: z.boolean(),
});

/** On-chain details for a registered agent (mirrors ReputationRegistry.AgentDetails). */
export type AgentDetails = z.infer<typeof AgentDetailsSchema>;

/** An agent's score with computed grade. */
export const AgentScoreSchema = z.object({
	agent: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
	score: z.number().int().min(0).max(1000),
	grade: z.enum(SCORE_GRADES),
});

export type AgentScore = z.infer<typeof AgentScoreSchema>;
