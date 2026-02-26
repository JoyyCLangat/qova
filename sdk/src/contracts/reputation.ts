/**
 * Contract wrapper for ReputationRegistry.
 * @author Qova Engineering <eng@qova.cc>
 */

import type { Address, Hash, Hex, PublicClient, WalletClient } from "viem";
import { ContractFunctionRevertedError } from "viem";
import { reputationRegistryAbi } from "../abi/index.js";
import type { AgentDetails } from "../types/agent.js";
import { mapContractError, QovaError } from "../types/errors.js";

/**
 * Get the reputation score for an agent.
 * @param client - viem PublicClient.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agent - The agent's Ethereum address.
 * @returns The score as a number (0-1000).
 * @throws {AgentNotRegisteredError} If the agent is not registered.
 */
export async function getScore(
	client: PublicClient,
	contractAddress: Address,
	agent: Address,
): Promise<number> {
	try {
		const result = await client.readContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "getScore",
			args: [agent],
		});
		return Number(result);
	} catch (error) {
		if (error instanceof ContractFunctionRevertedError && error.data) {
			throw mapContractError(
				error.data.errorName,
				error.data.args as readonly unknown[] | undefined,
			);
		}
		throw new QovaError("Failed to read score", "READ_FAILED", error);
	}
}

/**
 * Get full agent details struct from ReputationRegistry.
 * @param client - viem PublicClient.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agent - The agent's Ethereum address.
 * @returns AgentDetails with score, lastUpdated, updateCount, isRegistered.
 */
export async function getAgentDetails(
	client: PublicClient,
	contractAddress: Address,
	agent: Address,
): Promise<AgentDetails> {
	try {
		const result = await client.readContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "getAgentDetails",
			args: [agent],
		});
		return {
			score: Number(result.score),
			lastUpdated: BigInt(result.lastUpdated),
			updateCount: Number(result.updateCount),
			isRegistered: result.registered,
		};
	} catch (error) {
		throw new QovaError("Failed to read agent details", "READ_FAILED", error);
	}
}

/**
 * Check whether an agent is registered in the ReputationRegistry.
 * @param client - viem PublicClient.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agent - The agent's Ethereum address.
 * @returns True if the agent is registered.
 */
export async function isAgentRegistered(
	client: PublicClient,
	contractAddress: Address,
	agent: Address,
): Promise<boolean> {
	try {
		return await client.readContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "isRegistered",
			args: [agent],
		});
	} catch (error) {
		throw new QovaError("Failed to check registration", "READ_FAILED", error);
	}
}

/**
 * Register a new agent with an initial score of 0.
 * @param wallet - viem WalletClient for signing.
 * @param publicClient - viem PublicClient for simulation.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agent - The agent address to register.
 * @returns The transaction hash.
 * @throws {AgentAlreadyRegisteredError} If the agent is already registered.
 */
export async function registerAgent(
	wallet: WalletClient,
	publicClient: PublicClient,
	contractAddress: Address,
	agent: Address,
): Promise<Hash> {
	try {
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "registerAgent",
			args: [agent],
			account: wallet.account ?? undefined,
		});
		return wallet.writeContract(request);
	} catch (error) {
		if (error instanceof ContractFunctionRevertedError && error.data) {
			throw mapContractError(
				error.data.errorName,
				error.data.args as readonly unknown[] | undefined,
			);
		}
		throw new QovaError("Failed to register agent", "WRITE_FAILED", error);
	}
}

/**
 * Update an agent's reputation score.
 * @param wallet - viem WalletClient for signing.
 * @param publicClient - viem PublicClient for simulation.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agent - The registered agent address.
 * @param score - The new score (0-1000).
 * @param reason - Application-defined reason tag (bytes32).
 * @returns The transaction hash.
 * @throws {InvalidScoreError} If score > 1000.
 * @throws {AgentNotRegisteredError} If agent is not registered.
 */
export async function updateScore(
	wallet: WalletClient,
	publicClient: PublicClient,
	contractAddress: Address,
	agent: Address,
	score: number,
	reason: Hex,
): Promise<Hash> {
	try {
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "updateScore",
			args: [agent, score, reason],
			account: wallet.account ?? undefined,
		});
		return wallet.writeContract(request);
	} catch (error) {
		if (error instanceof ContractFunctionRevertedError && error.data) {
			throw mapContractError(
				error.data.errorName,
				error.data.args as readonly unknown[] | undefined,
			);
		}
		throw new QovaError("Failed to update score", "WRITE_FAILED", error);
	}
}

/**
 * Batch-update scores for multiple agents in a single transaction.
 * @param wallet - viem WalletClient for signing.
 * @param publicClient - viem PublicClient for simulation.
 * @param contractAddress - ReputationRegistry contract address.
 * @param agents - Array of registered agent addresses.
 * @param scores - Corresponding new scores (0-1000 each).
 * @param reasons - Corresponding reason tags (bytes32 each).
 * @returns The transaction hash.
 * @throws {ArrayLengthMismatchError} If array lengths don't match.
 */
export async function batchUpdateScores(
	wallet: WalletClient,
	publicClient: PublicClient,
	contractAddress: Address,
	agents: Address[],
	scores: number[],
	reasons: Hex[],
): Promise<Hash> {
	try {
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: reputationRegistryAbi,
			functionName: "batchUpdateScores",
			args: [agents, scores, reasons],
			account: wallet.account ?? undefined,
		});
		return wallet.writeContract(request);
	} catch (error) {
		if (error instanceof ContractFunctionRevertedError && error.data) {
			throw mapContractError(
				error.data.errorName,
				error.data.args as readonly unknown[] | undefined,
			);
		}
		throw new QovaError("Failed to batch update scores", "WRITE_FAILED", error);
	}
}
