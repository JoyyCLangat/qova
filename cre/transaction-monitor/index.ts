/**
 * @file transaction-monitor/index.ts
 * CRE Workflow: Transaction Monitor
 *
 * Trigger: EVM Log (TransactionRecorded events on TransactionValidator)
 * Purpose: Reacts to new agent transactions, runs fraud/anomaly check via
 *          off-chain API, and sends alerts via webhook if anomalies detected.
 */

import {
	bytesToHex,
	consensusIdenticalAggregation,
	cre,
	type EVMLog,
	encodeCallMsg,
	getNetwork,
	type HTTPSendRequester,
	json,
	LAST_FINALIZED_BLOCK_NUMBER,
	ok,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import { type Address, decodeFunctionResult, encodeFunctionData, zeroAddress } from "viem";
import { REPUTATION_REGISTRY_ABI } from "../shared/contracts";
import { type TransactionMonitorConfig, TransactionMonitorConfigSchema } from "../shared/types";

export async function main(): Promise<void> {
	const runner = await Runner.newRunner<TransactionMonitorConfig>({
		configSchema: TransactionMonitorConfigSchema,
	});
	await runner.run(initWorkflow);
}

function initWorkflow(config: TransactionMonitorConfig) {
	const { chainSelectorName, transactionValidator } = config.evm;

	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);

	// EVM Log trigger -- fires when TransactionRecorded event is emitted
	// TransactionRecorded(address indexed agent, bytes32 indexed txHash, uint256 amount, uint8 txType, uint48 timestamp)
	const logTrigger = evmClient.logTrigger({
		addresses: [transactionValidator],
		// topic[0] = event signature hash
		topics: [{ values: ["0x9e01dbe80e0d45ff3a91deb78de18f8c7d498e13e9d0e1f7a18c84e8b0e14f9a"] }],
	});

	return [
		cre.handler(logTrigger, (runtime: Runtime<TransactionMonitorConfig>, log: EVMLog) =>
			onTransactionRecorded(runtime, log),
		),
	];
}

function onTransactionRecorded(runtime: Runtime<TransactionMonitorConfig>, log: EVMLog): string {
	const config = runtime.config;
	const httpClient = new cre.capabilities.HTTPClient();

	// Extract data from the EVM log
	const agentAddress = bytesToHex(log.topics[1] ?? new Uint8Array());
	const txHash = bytesToHex(log.topics[2] ?? new Uint8Array());
	const logData = bytesToHex(log.data);

	runtime.log(`Transaction detected: agent=${agentAddress}, tx=${txHash}`);

	// Step 1: Read current score for context
	const { chainSelectorName, reputationRegistry } = config.evm;
	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);

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

	const currentScore = decodeFunctionResult({
		abi: REPUTATION_REGISTRY_ABI,
		functionName: "getScore",
		data: bytesToHex(scoreResult.data),
	}) as number;

	// Step 2: Run anomaly detection via off-chain API
	const checkAnomaly = (
		sendRequester: HTTPSendRequester,
		apiUrl: string,
	): { anomalyDetected: boolean; riskScore: number; flags: string[] } => {
		const response = sendRequester
			.sendRequest({
				url: `${apiUrl}/anomaly-check`,
				method: "POST",
				body: JSON.stringify({
					agent: agentAddress,
					txHash,
					logData,
					currentScore,
				}),
			})
			.result();
		if (!ok(response)) throw new Error(`Anomaly check failed: ${response.statusCode}`);
		return json(response) as { anomalyDetected: boolean; riskScore: number; flags: string[] };
	};

	const anomalyResult = httpClient
		.sendRequest(
			runtime,
			checkAnomaly,
			consensusIdenticalAggregation(),
		)(config.scoringApiUrl)
		.result();

	// Step 3: If anomaly detected and webhook configured, send alert
	if (anomalyResult.anomalyDetected && config.alertWebhookUrl) {
		const sendAlert = (sendRequester: HTTPSendRequester, webhookUrl: string): string => {
			const response = sendRequester
				.sendRequest({
					url: webhookUrl,
					method: "POST",
					body: JSON.stringify({
						type: "TRANSACTION_ANOMALY",
						severity: anomalyResult.riskScore > 0.8 ? "CRITICAL" : "WARNING",
						agent: agentAddress,
						txHash,
						riskScore: anomalyResult.riskScore,
						flags: anomalyResult.flags,
						currentScore,
						timestamp: Date.now(),
					}),
				})
				.result();
			return ok(response) ? "alert_sent" : "alert_failed";
		};

		httpClient
			.sendRequest(
				runtime,
				sendAlert,
				consensusIdenticalAggregation(),
			)(config.alertWebhookUrl)
			.result();

		runtime.log(`Alert sent for agent ${agentAddress}: risk=${anomalyResult.riskScore}`);
	}

	return JSON.stringify({
		agent: agentAddress,
		txHash,
		anomalyDetected: anomalyResult.anomalyDetected,
		riskScore: anomalyResult.riskScore,
	});
}

main();
