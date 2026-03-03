import { QovaConfigError } from "./errors.js";
import type { FetchConfig } from "./fetch.js";
import { request } from "./fetch.js";
import { Agents } from "./agents.js";
import { Budgets } from "./budgets.js";
import { Keys } from "./keys.js";
import { Scores } from "./scores.js";
import { Transactions } from "./transactions.js";
import { Verify } from "./verify.js";
import type { HealthResponse, VerifyResponse } from "./types.js";

export interface QovaOptions {
	baseUrl?: string;
	timeout?: number;
	maxRetries?: number;
	retryDelay?: number;
	headers?: Record<string, string>;
}

const DEFAULT_BASE_URL = "https://api.qova.cc";
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1_000;

/**
 * Qova HTTP SDK — the primary interface for developers.
 *
 * @example
 * ```ts
 * import Qova from "@qova/core";
 * const qova = new Qova("qova_your_api_key");
 * const { score, grade } = await qova.agents.score("0x...");
 * ```
 */
export class Qova {
	/** Agent registration, scores, and details. */
	readonly agents: Agents;
	/** Score computation, breakdowns, enrichment. */
	readonly scores: Scores;
	/** Transaction recording and statistics. */
	readonly transactions: Transactions;
	/** Budget management and enforcement. */
	readonly budgets: Budgets;
	/** API key management. */
	readonly keys: Keys;

	private readonly _verify: Verify;
	private readonly config: FetchConfig;

	constructor(apiKey: string, options: QovaOptions = {}) {
		if (!apiKey || typeof apiKey !== "string") {
			throw new QovaConfigError(
				"API key is required. Get one at https://qova.cc/dashboard/settings/api-keys",
			);
		}

		if (!apiKey.startsWith("qova_")) {
			throw new QovaConfigError("Invalid API key format. Keys start with qova_");
		}

		this.config = {
			baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
			apiKey,
			timeout: options.timeout ?? DEFAULT_TIMEOUT,
			maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
			retryDelay: options.retryDelay ?? DEFAULT_RETRY_DELAY,
			headers: options.headers ?? {},
		};

		this.agents = new Agents(this.config);
		this.scores = new Scores(this.config);
		this.transactions = new Transactions(this.config);
		this.budgets = new Budgets(this.config);
		this.keys = new Keys(this.config);
		this._verify = new Verify(this.config);
	}

	/** Quick trust verification before a transaction. */
	async verify(agent: string): Promise<VerifyResponse> {
		return this._verify.agent(agent);
	}

	/** Sanctions screening on an agent address. */
	async sanctionsCheck(agent: string) {
		return this._verify.sanctions(agent);
	}

	/** API health check. */
	async health(): Promise<HealthResponse> {
		return request<HealthResponse>(this.config, {
			method: "GET",
			path: "/api/health",
		});
	}
}
