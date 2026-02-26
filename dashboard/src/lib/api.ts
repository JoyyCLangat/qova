const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public code?: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: { "Content-Type": "application/json", ...options?.headers },
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({ error: "Request failed" }));
		throw new ApiError(res.status, body.error || "Unknown error", body.code);
	}
	return res.json();
}

export interface AgentListResponse {
	agents: string[];
	total: number;
}

export interface AgentDetailsResponse {
	agent: string;
	score: number;
	grade: string;
	gradeColor: string;
	scoreFormatted: string;
	scorePercentage: number;
	lastUpdated: string;
	updateCount: number;
	isRegistered: boolean;
	addressShort: string;
	explorerUrl: string;
}

export interface AgentScoreResponse {
	agent: string;
	score: number;
	grade: string;
	gradeColor: string;
	scoreFormatted: string;
	scorePercentage: number;
}

export interface ScoreBreakdownFactor {
	raw: string | number;
	normalized: number;
	weight: number;
	contribution: number;
}

export interface ScoreBreakdownResponse {
	agent: string;
	score: number;
	grade: string;
	gradeColor: string;
	factors: {
		transactionVolume: ScoreBreakdownFactor;
		transactionCount: ScoreBreakdownFactor;
		successRate: ScoreBreakdownFactor;
		budgetCompliance: ScoreBreakdownFactor;
		accountAge: ScoreBreakdownFactor;
	};
	timestamp: string;
}

export interface TxStatsResponse {
	agent: string;
	addressShort: string;
	totalCount: number;
	totalVolume: string;
	totalVolumeWei: string;
	successRate: string;
	successRateBps: number;
	lastActivity: string;
}

export interface BudgetResponse {
	agent: string;
	config: {
		dailyLimit: string;
		monthlyLimit: string;
		perTxLimit: string;
	};
	usage: {
		dailySpent: string;
		monthlySpent: string;
		dailyRemaining: string;
		monthlyRemaining: string;
	};
	utilization: {
		daily: string;
		monthly: string;
	};
	raw: Record<string, string>;
}

export interface VerifyResponse {
	agent: string;
	verified: boolean;
	score: number;
	grade: string;
	sanctionsClean: boolean;
	isRegistered: boolean;
	timestamp: string;
}

export interface HealthResponse {
	status: string;
	timestamp: string;
	chain: string;
}

export const api = {
	getAgents: () => fetchJson<AgentListResponse>("/agents"),
	getAgent: (addr: string) => fetchJson<AgentDetailsResponse>(`/agents/${addr}`),
	getAgentScore: (addr: string) => fetchJson<AgentScoreResponse>(`/agents/${addr}/score`),
	getScoreBreakdown: (addr: string) => fetchJson<ScoreBreakdownResponse>(`/scores/${addr}`),
	getTxStats: (addr: string) => fetchJson<TxStatsResponse>(`/transactions/${addr}/stats`),
	getBudget: (addr: string) => fetchJson<BudgetResponse>(`/budgets/${addr}`),
	verify: (addr: string) =>
		fetchJson<VerifyResponse>("/verify", {
			method: "POST",
			body: JSON.stringify({ agent: addr }),
		}),
	health: () => fetchJson<HealthResponse>("/health"),
} as const;
