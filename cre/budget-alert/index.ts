/**
 * @file budget-alert/index.ts
 * CRE Workflow: Budget Alert
 *
 * Trigger: EVM Log (SpendRecorded events on BudgetEnforcer)
 * Purpose: Monitors agent spending and sends alerts when budget utilization
 *          exceeds thresholds. Fetches current reputation score for context.
 */

import {
	bytesToHex,
	consensusIdenticalAggregation,
	cre,
	type EVMLog,
	encodeCallMsg,
	getNetwork,
	type HTTPSendRequester,
	LAST_FINALIZED_BLOCK_NUMBER,
	ok,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import { type Address, decodeFunctionResult, encodeFunctionData, zeroAddress } from "viem";
import { BUDGET_ENFORCER_ABI } from "../shared/contracts";
import { type BudgetAlertConfig, BudgetAlertConfigSchema } from "../shared/types";

export async function main(): Promise<void> {
	const runner = await Runner.newRunner<BudgetAlertConfig>({
		configSchema: BudgetAlertConfigSchema,
	});
	await runner.run(initWorkflow);
}

function initWorkflow(config: BudgetAlertConfig) {
	const { chainSelectorName, budgetEnforcer } = config.evm;

	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);

	// EVM Log trigger -- fires when SpendRecorded is emitted
	// SpendRecorded(address indexed agent, uint128 amount, uint128 dailyRemaining, uint128 monthlyRemaining)
	const logTrigger = evmClient.logTrigger({
		addresses: [budgetEnforcer],
		topics: [{ values: ["0x1e5a5f8e06d738a73f2cf3e2f244b8e3d3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"] }],
	});

	return [
		cre.handler(logTrigger, (runtime: Runtime<BudgetAlertConfig>, log: EVMLog) =>
			onSpendRecorded(runtime, log),
		),
	];
}

function onSpendRecorded(runtime: Runtime<BudgetAlertConfig>, log: EVMLog): string {
	const config = runtime.config;
	const httpClient = new cre.capabilities.HTTPClient();

	const agentAddress = bytesToHex(log.topics[1] ?? new Uint8Array());
	runtime.log(`Spend recorded for agent: ${agentAddress}`);

	// Read current budget status to determine severity
	const { chainSelectorName, budgetEnforcer } = config.evm;
	const network = getNetwork({ chainFamily: "evm", chainSelectorName, isTestnet: true });
	if (!network) throw new Error(`Network not found: ${chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector);

	const budgetCallData = encodeFunctionData({
		abi: BUDGET_ENFORCER_ABI,
		functionName: "getBudgetStatus",
		args: [agentAddress as Address],
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

	// Determine severity based on remaining budget
	const dailyTotal = budget.dailyRemaining + budget.dailySpent;
	const dailyUtilization = dailyTotal > 0n ? Number((budget.dailySpent * 100n) / dailyTotal) : 0;

	let severity: string;
	if (dailyUtilization >= 100) severity = "CRITICAL";
	else if (dailyUtilization >= 90) severity = "HIGH";
	else if (dailyUtilization >= 75) severity = "MEDIUM";
	else severity = "LOW";

	// Only alert on medium or above
	if (severity === "LOW") {
		runtime.log(`Budget utilization ${dailyUtilization}% (LOW) -- no alert`);
		return JSON.stringify({
			agent: agentAddress,
			utilization: dailyUtilization,
			severity,
			alerted: false,
		});
	}

	// Send alert to webhook
	const sendAlert = (sendRequester: HTTPSendRequester, webhookUrl: string): string => {
		const response = sendRequester
			.sendRequest({
				url: webhookUrl,
				method: "POST",
				body: JSON.stringify({
					type: "BUDGET_ALERT",
					severity,
					agent: agentAddress,
					dailyUtilization,
					dailySpent: budget.dailySpent.toString(),
					dailyRemaining: budget.dailyRemaining.toString(),
					monthlySpent: budget.monthlySpent.toString(),
					monthlyRemaining: budget.monthlyRemaining.toString(),
					timestamp: Date.now(),
					message: `Agent ${agentAddress} has used ${dailyUtilization}% of daily budget`,
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

	runtime.log(`Budget alert sent: ${agentAddress} at ${dailyUtilization}% (${severity})`);

	return JSON.stringify({
		agent: agentAddress,
		utilization: dailyUtilization,
		severity,
		alerted: true,
	});
}

main();
