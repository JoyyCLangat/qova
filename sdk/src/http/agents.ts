/**
 * Agents resource — registration, scores, and details.
 * @author Qova Engineering <eng@qova.cc>
 */

import type { FetchConfig } from "./fetch.js";
import { request } from "./fetch.js";
import type {
	AgentDetailsResponse,
	AgentListResponse,
	AgentRegisteredResponse,
	AgentScoreResponse,
	BatchUpdateScoresResponse,
	RegisterAgentResponse,
	UpdateScoreResponse,
} from "./types.js";

export class Agents {
	constructor(private readonly config: FetchConfig) {}

	/** List all registered agents. */
	async list(): Promise<AgentListResponse> {
		return request<AgentListResponse>(this.config, {
			method: "GET",
			path: "/api/agents",
		});
	}

	/** Get enriched details for a single agent. */
	async get(address: string): Promise<AgentDetailsResponse> {
		return request<AgentDetailsResponse>(this.config, {
			method: "GET",
			path: `/api/agents/${address}`,
		});
	}

	/** Get an agent's current score with grade and color. */
	async score(address: string): Promise<AgentScoreResponse> {
		return request<AgentScoreResponse>(this.config, {
			method: "GET",
			path: `/api/agents/${address}/score`,
		});
	}

	/** Check whether an agent is registered. */
	async isRegistered(address: string): Promise<AgentRegisteredResponse> {
		return request<AgentRegisteredResponse>(this.config, {
			method: "GET",
			path: `/api/agents/${address}/registered`,
		});
	}

	/** Register a new agent on-chain. */
	async register(agent: string): Promise<RegisterAgentResponse> {
		return request<RegisterAgentResponse>(this.config, {
			method: "POST",
			path: "/api/agents/register",
			body: { agent },
		});
	}

	/** Update an agent's reputation score. */
	async updateScore(
		address: string,
		score: number,
		reason?: string,
	): Promise<UpdateScoreResponse> {
		return request<UpdateScoreResponse>(this.config, {
			method: "POST",
			path: `/api/agents/${address}/score`,
			body: { score, reason },
		});
	}

	/** Batch update scores for multiple agents in one call. */
	async batchUpdateScores(
		agents: string[],
		scores: number[],
		reasons: string[],
	): Promise<BatchUpdateScoresResponse> {
		return request<BatchUpdateScoresResponse>(this.config, {
			method: "POST",
			path: "/api/agents/batch-scores",
			body: { agents, scores, reasons },
		});
	}
}
