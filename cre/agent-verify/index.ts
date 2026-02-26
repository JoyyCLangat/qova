/**
 * @file agent-verify/index.ts
 * CRE Workflow: Agent Verify
 *
 * Trigger: HTTP POST /verify
 * Purpose: External services trigger on-demand agent verification.
 *          Reads on-chain reputation + transaction data, runs sanctions screening
 *          off-chain, and returns a verification attestation.
 */

import {
	bytesToHex,
	consensusIdenticalAggregation,
	cre,
	encodeCallMsg,
	getNetwork,
	type HTTPPayload,
	type HTTPSendRequester,
	json,
	LAST_FINALIZED_BLOCK_NUMBER,
	ok,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import { type Address, decodeFunctionResult, encodeFunctionData, zeroAddress } from "viem";
import {
	BUDGET_ENFORCER_ABI,
	REPUTATION_REGISTRY_ABI,
	TRANSACTION_VALIDATOR_ABI,
} from "../shared/contracts";
import { type AgentVerifyConfig, AgentVerifyConfigSchema } from "../shared/types";

export async function main(): Promise<void> {
	const runner = await Runner.newRunner<AgentVerifyConfig>({
		configSchema: AgentVerifyConfigSchema,
	});
	await runner.run(initWorkflow);
}

function initWorkflow(_config: AgentVerifyConfig) {
	const httpCapability = new cre.capabilities.HTTPCapability();
	const httpTrigger = httpCapability.trigger({});

	return [
		cre.handler(httpTrigger, (runtime: Runtime<AgentVerifyConfig>, payload: HTTPPayload) =>
			onVerifyRequest(runtime, payload),
		),
	];
}

function onVerifyRequest(runtime: Runtime<AgentVerifyConfig>, payload: HTTPPayload): string {
	const config = runtime.config;
	const { chainSelectorName, reputationRegistry, transactionValidator, budgetEnforcer } =
		config.evm;

	// Parse agent address from HTTP request input
	const bodyStr = new TextDecoder().decode(payload.input);
	let requestBody: { agent?: string };
	try {
		requestBody = JSON.parse(bodyStr);
	} catch {
		return JSON.stringify({ error: "Invalid JSON body" });
	}

	const agentAddress = requestBody.agent;
	if (!agentAddress) {
		return JSON.stringify({ error: "Missing agent address in request body" });
	}

	runtime.log(`Verifying agent: ${agentAddress}`);

	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);
	const httpClient = new cre.capabilities.HTTPClient();

	// Step 1: Check if agent is registered
	const isRegisteredCallData = encodeFunctionData({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "isRegistered",
		args: [agentAddress as Address],
	});

	const isRegisteredResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: reputationRegistry as Address,
				data: isRegisteredCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const isRegistered = decodeFunctionResult({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "isRegistered",
		data: bytesToHex(isRegisteredResult.data),
	}) as boolean;

	if (!isRegistered) {
		return JSON.stringify({
			agent: agentAddress,
			verified: false,
			reason: "Agent not registered",
		});
	}

	// Step 2: Read current reputation score
	const scoreCallData = encodeFunctionData({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "getScore",
		args: [agentAddress as Address],
	});

	const scoreResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: reputationRegistry as Address,
				data: scoreCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const score = decodeFunctionResult({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "getScore",
		data: bytesToHex(scoreResult.data),
	}) as number;

	// Step 3: Read transaction stats
	const statsCallData = encodeFunctionData({
		abi: TRANSACTION_VALIDATOR_ABI,
		functionName: "getTransactionStats",
		args: [agentAddress as Address],
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

	// Step 4: Check budget status
	const hasBudgetCallData = encodeFunctionData({
		abi: BUDGET_ENFORCER_ABI,
		functionName: "hasBudget",
		args: [agentAddress as Address],
	});

	const hasBudgetResult = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: budgetEnforcer as Address,
				data: hasBudgetCallData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const hasBudget = decodeFunctionResult({
		abi: BUDGET_ENFORCER_ABI,
		functionName: "hasBudget",
		data: bytesToHex(hasBudgetResult.data),
	}) as boolean;

	// Step 5: Run sanctions screening off-chain
	const checkSanctions = (
		sendRequester: HTTPSendRequester,
		apiUrl: string,
	): { clean: boolean; source: string } => {
		const response = sendRequester
			.sendRequest({
				url: `${apiUrl}/check`,
				method: "POST",
				body: JSON.stringify({ agent: agentAddress }),
			})
			.result();
		if (!ok(response)) throw new Error(`Sanctions check failed: ${response.statusCode}`);
		return json(response) as { clean: boolean; source: string };
	};

	const sanctionsResult = httpClient
		.sendRequest(
			runtime,
			checkSanctions,
			consensusIdenticalAggregation(),
		)(config.sanctionsApiUrl)
		.result();

	// Step 6: Compute verification result
	const verified = sanctionsResult.clean && score > 0;
	const successRate =
		Number(stats.totalCount) > 0 ? Number((stats.successCount * 10000n) / stats.totalCount) : 0;

	// Determine grade
	let grade: string;
	if (score >= 950) grade = "AAA";
	else if (score >= 900) grade = "AA";
	else if (score >= 850) grade = "A";
	else if (score >= 750) grade = "BBB";
	else if (score >= 650) grade = "BB";
	else if (score >= 550) grade = "B";
	else if (score >= 450) grade = "CCC";
	else if (score >= 350) grade = "CC";
	else if (score >= 250) grade = "C";
	else grade = "D";

	runtime.log(
		`Verification complete: agent=${agentAddress}, verified=${verified}, score=${score}, grade=${grade}`,
	);

	return JSON.stringify({
		agent: agentAddress,
		verified,
		score,
		grade,
		sanctionsClean: sanctionsResult.clean,
		transactionCount: Number(stats.totalCount),
		successRate,
		totalVolume: stats.totalVolume.toString(),
		hasBudget,
		timestamp: Math.floor(Date.now() / 1000),
	});
}

main();
