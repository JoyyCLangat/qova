/**
 * @file reputation-oracle/index.ts
 * CRE Workflow: Reputation Oracle
 *
 * Trigger: Cron (every 5 minutes on staging)
 * Purpose: Reads agent data from Qova contracts, fetches off-chain enrichment,
 *          computes reputation scores via BFT consensus, writes scores on-chain.
 */

import {
	bytesToHex,
	type CronPayload,
	consensusIdenticalAggregation,
	cre,
	encodeCallMsg,
	getNetwork,
	type HTTPSendRequester,
	json,
	LAST_FINALIZED_BLOCK_NUMBER,
	ok,
	prepareReportRequest,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import {
	type Address,
	decodeFunctionResult,
	encodeFunctionData,
	keccak256,
	toHex,
	zeroAddress,
} from "viem";
import { MIN_SCORE_CHANGE } from "../shared/constants";
import {
	BUDGET_ENFORCER_ABI,
	REPUTATION_REGISTRY_ABI,
	TRANSACTION_VALIDATOR_ABI,
} from "../shared/contracts";
import { type AgentMetrics, computeReputationScore } from "../shared/scoring";
import { type ReputationOracleConfig, ReputationOracleConfigSchema } from "../shared/types";

export async function main(): Promise<void> {
	const runner = await Runner.newRunner<ReputationOracleConfig>({
		configSchema: ReputationOracleConfigSchema,
	});
	await runner.run(initWorkflow);
}

function initWorkflow(config: ReputationOracleConfig) {
	const cronCapability = new cre.capabilities.CronCapability();
	const cronTrigger = cronCapability.trigger({ schedule: config.schedule });

	return [
		cre.handler(
			cronTrigger,
			(runtime: Runtime<ReputationOracleConfig>, _triggerOutput: CronPayload) =>
				onCronTick(runtime),
		),
	];
}

function onCronTick(runtime: Runtime<ReputationOracleConfig>): string {
	const config = runtime.config;
	const { chainSelectorName, reputationRegistry, transactionValidator, budgetEnforcer } =
		config.evm;

	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);
	const httpClient = new cre.capabilities.HTTPClient();

	// Step 1: Fetch list of agents to score from the off-chain API
	const fetchAgents = (sendRequester: HTTPSendRequester, apiUrl: string): string[] => {
		const response = sendRequester.sendRequest({ url: `${apiUrl}/agents`, method: "GET" }).result();
		if (!ok(response)) throw new Error(`Failed to fetch agents: ${response.statusCode}`);
		const data = json(response) as { agents: string[] };
		return data.agents;
	};

	const agents = httpClient
		.sendRequest(
			runtime,
			fetchAgents,
			consensusIdenticalAggregation(),
		)(config.scoringApiUrl)
		.result();

	if (!agents || agents.length === 0) {
		runtime.log("No agents to score");
		return "no_agents";
	}

	// For hackathon demo, process first agent
	const agentAddress = agents[0] as Address;
	runtime.log(`Scoring agent: ${agentAddress}`);

	// Step 2: Read on-chain data -- agent details from ReputationRegistry
	const detailsCallData = encodeFunctionData({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "getAgentDetails",
		args: [agentAddress],
	});

	const detailsResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: reputationRegistry as Address,
				data: detailsCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const agentDetails = decodeFunctionResult({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "getAgentDetails",
		data: bytesToHex(detailsResult.data),
	});

	const currentScore = (agentDetails as { score: number }).score;

	// Step 3: Read transaction stats from TransactionValidator
	const statsCallData = encodeFunctionData({
		abi: TRANSACTION_VALIDATOR_ABI,
		functionName: "getTransactionStats",
		args: [agentAddress],
	});

	const statsResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: transactionValidator as Address,
				data: statsCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const stats = decodeFunctionResult({
		abi: TRANSACTION_VALIDATOR_ABI,
		functionName: "getTransactionStats",
		data: bytesToHex(statsResult.data),
	}) as unknown as {
		totalCount: bigint;
		totalVolume: bigint;
		successCount: bigint;
		lastActivityTimestamp: bigint;
	};

	// Step 4: Read success rate
	const successRateCallData = encodeFunctionData({
		abi: TRANSACTION_VALIDATOR_ABI,
		functionName: "getSuccessRate",
		args: [agentAddress],
	});

	const successRateResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: transactionValidator as Address,
				data: successRateCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const successRate = decodeFunctionResult({
		abi: TRANSACTION_VALIDATOR_ABI,
		functionName: "getSuccessRate",
		data: bytesToHex(successRateResult.data),
	}) as bigint;

	// Step 5: Read budget status from BudgetEnforcer
	const budgetCallData = encodeFunctionData({
		abi: BUDGET_ENFORCER_ABI,
		functionName: "getBudgetStatus",
		args: [agentAddress],
	});

	const budgetResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: budgetEnforcer as Address,
				data: budgetCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const budget = decodeFunctionResult({
		abi: BUDGET_ENFORCER_ABI,
		functionName: "getBudgetStatus",
		data: bytesToHex(budgetResult.data),
	}) as {
		dailyRemaining: bigint;
		monthlyRemaining: bigint;
		perTxLimit: bigint;
		dailySpent: bigint;
		monthlySpent: bigint;
	};

	// Step 6: Fetch off-chain enrichment (sanctions check, external reputation)
	const fetchEnrichment = (
		sendRequester: HTTPSendRequester,
		apiUrl: string,
	): { sanctionsClean: boolean; apiReputationScore: number } => {
		const response = sendRequester
			.sendRequest({
				url: `${apiUrl}/enrich`,
				method: "POST",
				body: JSON.stringify({ agent: agentAddress }),
			})
			.result();
		if (!ok(response)) throw new Error(`Enrichment failed: ${response.statusCode}`);
		return json(response) as { sanctionsClean: boolean; apiReputationScore: number };
	};

	const enrichment = httpClient
		.sendRequest(
			runtime,
			fetchEnrichment,
			consensusIdenticalAggregation(),
		)(config.scoringApiUrl)
		.result();

	// Step 7: Compute new reputation score
	const now = runtime.now();
	const lastActivity = Number(stats.lastActivityTimestamp);
	const accountAge = lastActivity > 0 ? Math.floor(now.getTime() / 1000) - lastActivity : 0;

	// Reconstruct daily limit from budget remaining + spent
	const dailyLimit = budget.dailyRemaining + budget.dailySpent;

	const metrics: AgentMetrics = {
		totalVolume: stats.totalVolume,
		transactionCount: Number(stats.totalCount),
		successRate: Number(successRate),
		dailySpent: budget.dailySpent,
		dailyLimit,
		accountAgeSeconds: accountAge,
		sanctionsClean: enrichment.sanctionsClean,
		apiReputationScore: enrichment.apiReputationScore,
	};

	const newScore = computeReputationScore(metrics);
	runtime.log(`Agent ${agentAddress}: current=${currentScore}, computed=${newScore}`);

	// Step 8: Only write on-chain if the score change is significant
	const scoreDiff = Math.abs(newScore - currentScore);
	if (scoreDiff < MIN_SCORE_CHANGE) {
		runtime.log(
			`Score change (${scoreDiff}) below threshold (${MIN_SCORE_CHANGE}), skipping write`,
		);
		return JSON.stringify({ agent: agentAddress, score: newScore, skipped: true });
	}

	// Step 9: Prepare on-chain write via CRE report
	const reason = keccak256(toHex("cre-reputation-oracle"));
	const writeCallData = encodeFunctionData({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "updateScore",
		args: [agentAddress, newScore, reason],
	});

	const report = runtime.report(prepareReportRequest(writeCallData)).result();

	evmClient
		.writeReport(runtime, {
			receiver: reputationRegistry,
			report,
		})
		.result();

	runtime.log(`Score updated on-chain: ${agentAddress} -> ${newScore}`);

	return JSON.stringify({
		agent: agentAddress,
		oldScore: currentScore,
		newScore,
		factors: {
			volume: Number(stats.totalVolume),
			count: Number(stats.totalCount),
			successRate: Number(successRate),
			budgetCompliance: Number(budget.dailySpent),
		},
	});
}

main();
