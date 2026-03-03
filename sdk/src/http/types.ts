/**
 * Response types for every Qova API endpoint.
 * @author Qova Engineering <eng@qova.cc>
 */

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

export interface AgentRegisteredResponse {
	agent: string;
	isRegistered: boolean;
}

export interface RegisterAgentResponse {
	txHash: string;
	agent: string;
}

export interface UpdateScoreResponse {
	txHash: string;
	agent: string;
	newScore: number;
}

export interface BatchUpdateScoresResponse {
	txHash: string;
	count: number;
}

export interface FactorDetail {
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
		transactionVolume: FactorDetail;
		transactionCount: FactorDetail;
		successRate: FactorDetail;
		budgetCompliance: FactorDetail;
		accountAge: FactorDetail;
	};
	timestamp: string;
}

export interface ComputeScoreInput {
	totalVolume: string;
	transactionCount: number;
	successRate: number;
	dailySpent: string;
	dailyLimit: string;
	accountAgeSeconds: number;
	sanctionsClean?: boolean;
	apiReputationScore?: number;
}

export interface ComputeScoreResponse {
	score: number;
	grade: string;
	gradeColor: string;
}

export interface EnrichResponse {
	sanctionsClean: boolean;
	apiReputationScore: number;
	riskLevel: string;
	lastChecked: number;
}

export interface AnomalyCheckResponse {
	anomalyDetected: boolean;
	riskScore: number;
	flags: string[];
}

export interface TransactionStatsResponse {
	agent: string;
	totalCount: number;
	totalVolume: string;
	successCount: number;
	lastActivityTimestamp: string;
}

export interface RecordTransactionInput {
	agent: string;
	txHash: string;
	amount: string;
	txType: number;
}

export interface TxHashResponse {
	txHash: string;
}

export interface BudgetStatusResponse {
	agent: string;
	dailyRemaining: string;
	monthlyRemaining: string;
	perTxLimit: string;
	dailySpent: string;
	monthlySpent: string;
}

export interface SetBudgetInput {
	dailyLimit: string;
	monthlyLimit: string;
	perTxLimit: string;
}

export interface CheckBudgetResponse {
	agent: string;
	withinBudget: boolean;
	amount: string;
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

export interface SanctionsResponse {
	clean: boolean;
	checked: boolean;
	source: string;
	timestamp: number;
}

export interface HealthResponse {
	status: "ok" | "degraded";
	timestamp: string;
	chain: string;
	chainId: number;
	contracts: Record<string, { address: string; accessible: boolean }>;
	sdk: { version: string };
	api: { version: string };
}

export interface CreateApiKeyInput {
	name: string;
	scopes: string[];
	expiresInDays?: number;
}

export interface CreateApiKeyResponse {
	key: string;
	keyPrefix: string;
	name: string;
	scopes: string[];
	expiresAt: string | null;
	warning: string;
}

export interface ApiKeyListResponse {
	keys: Array<{
		id: string;
		name: string;
		keyPrefix: string;
		scopes: string[];
		createdAt: string;
		expiresAt: string | null;
		isActive: boolean;
	}>;
}

export interface RevokeApiKeyResponse {
	revoked: boolean;
	id: string;
}
