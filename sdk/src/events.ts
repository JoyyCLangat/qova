/**
 * Event watchers for Qova contract events using viem's watchContractEvent.
 * @author Qova Engineering <eng@qova.cc>
 */

import { type Address, createPublicClient, http, type PublicClient } from "viem";
import { base, baseSepolia } from "viem/chains";
import { qovaCoreAbi, reputationRegistryAbi, transactionValidatorAbi } from "./abi/index.js";
import { CHAIN_IDS, CONTRACTS, DEFAULT_RPC_URLS } from "./constants.js";
import type {
	AgentActionExecutedEvent,
	ScoreUpdatedEvent,
	TransactionRecordedEvent,
	WatchConfig,
} from "./types/events.js";
import type { TransactionType } from "./types/transaction.js";

const CHAIN_MAP = {
	"base-sepolia": baseSepolia,
	base: base,
} as const;

const CHAIN_ID_FROM_NAME = {
	"base-sepolia": CHAIN_IDS.BASE_SEPOLIA,
	base: CHAIN_IDS.BASE_MAINNET,
} as const;

function resolveClient(config: WatchConfig): { publicClient: PublicClient; chainId: number } {
	const chainId = CHAIN_ID_FROM_NAME[config.chain];
	const chain = CHAIN_MAP[config.chain];
	const rpcUrl = config.rpcUrl ?? DEFAULT_RPC_URLS[chainId];
	// Cast needed for L2 chain type compatibility (OP stack deposit tx types)
	const publicClient = createPublicClient({ chain, transport: http(rpcUrl) }) as PublicClient;
	return { publicClient, chainId };
}

/**
 * Watch for ScoreUpdated events from the ReputationRegistry.
 * @param config - Watch configuration (chain, optional rpcUrl/fromBlock/agent filter).
 * @param callback - Called when a ScoreUpdated event is detected.
 * @returns Unsubscribe function to stop watching.
 * @example
 * ```ts
 * const unwatch = watchScoreUpdates({ chain: "base-sepolia" }, (event) => {
 *   console.log(`${event.agent}: ${event.oldScore} -> ${event.newScore}`);
 * });
 * // Later: unwatch();
 * ```
 */
export function watchScoreUpdates(
	config: WatchConfig,
	callback: (event: ScoreUpdatedEvent) => void,
): () => void {
	const { publicClient, chainId } = resolveClient(config);
	const contracts = CONTRACTS[chainId];
	if (!contracts) throw new Error(`No contracts on chain ${config.chain}`);

	return publicClient.watchContractEvent({
		address: contracts.ReputationRegistry,
		abi: reputationRegistryAbi,
		eventName: "ScoreUpdated",
		onLogs: (logs) => {
			for (const log of logs) {
				if (!log.args) continue;
				const a = log.args as Record<string, unknown>;
				if (config.agent && a.agent !== config.agent) continue;
				callback({
					agent: a.agent as Address,
					oldScore: Number(a.oldScore),
					newScore: Number(a.newScore),
					reason: a.reason as `0x${string}`,
					timestamp: BigInt(a.timestamp as number | bigint),
				});
			}
		},
	});
}

/**
 * Watch for TransactionRecorded events from the TransactionValidator.
 * @param config - Watch configuration.
 * @param callback - Called when a TransactionRecorded event is detected.
 * @returns Unsubscribe function.
 */
export function watchTransactions(
	config: WatchConfig,
	callback: (event: TransactionRecordedEvent) => void,
): () => void {
	const { publicClient, chainId } = resolveClient(config);
	const contracts = CONTRACTS[chainId];
	if (!contracts) throw new Error(`No contracts on chain ${config.chain}`);

	return publicClient.watchContractEvent({
		address: contracts.TransactionValidator,
		abi: transactionValidatorAbi,
		eventName: "TransactionRecorded",
		onLogs: (logs) => {
			for (const log of logs) {
				if (!log.args) continue;
				const a = log.args as Record<string, unknown>;
				if (config.agent && a.agent !== config.agent) continue;
				callback({
					agent: a.agent as Address,
					txHash: a.txHash as `0x${string}`,
					amount: BigInt(a.amount as number | bigint),
					txType: Number(a.txType) as TransactionType,
					timestamp: BigInt(a.timestamp as number | bigint),
				});
			}
		},
	});
}

/**
 * Watch for AgentActionExecuted events from QovaCore.
 * @param config - Watch configuration.
 * @param callback - Called when an AgentActionExecuted event is detected.
 * @returns Unsubscribe function.
 */
export function watchAgentActions(
	config: WatchConfig,
	callback: (event: AgentActionExecutedEvent) => void,
): () => void {
	const { publicClient, chainId } = resolveClient(config);
	const contracts = CONTRACTS[chainId];
	if (!contracts) throw new Error(`No contracts on chain ${config.chain}`);

	return publicClient.watchContractEvent({
		address: contracts.QovaCore,
		abi: qovaCoreAbi,
		eventName: "AgentActionExecuted",
		onLogs: (logs) => {
			for (const log of logs) {
				if (!log.args) continue;
				const a = log.args as Record<string, unknown>;
				if (config.agent && a.agent !== config.agent) continue;
				callback({
					agent: a.agent as Address,
					txHash: a.txHash as `0x${string}`,
					amount: BigInt(a.amount as number | bigint),
					txType: Number(a.txType) as TransactionType,
					timestamp: BigInt(a.timestamp as number | bigint),
				});
			}
		},
	});
}
