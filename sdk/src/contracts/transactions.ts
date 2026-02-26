/**
 * Contract wrapper for TransactionValidator.
 * @author Qova Engineering <eng@qova.cc>
 */

import type { Address, Hash, Hex, PublicClient, WalletClient } from "viem";
import { ContractFunctionRevertedError } from "viem";
import { transactionValidatorAbi } from "../abi/index.js";
import { mapContractError, QovaError } from "../types/errors.js";
import type { TransactionStats, TransactionType } from "../types/transaction.js";

/**
 * Record a new transaction for an agent.
 * @param wallet - viem WalletClient for signing.
 * @param publicClient - viem PublicClient for simulation.
 * @param contractAddress - TransactionValidator contract address.
 * @param agent - The agent address.
 * @param txHash - External transaction hash or identifier (bytes32).
 * @param amount - Value of the transaction (must be > 0).
 * @param txType - Classification of the transaction (0-4).
 * @returns The transaction hash.
 */
export async function recordTransaction(
	wallet: WalletClient,
	publicClient: PublicClient,
	contractAddress: Address,
	agent: Address,
	txHash: Hex,
	amount: bigint,
	txType: TransactionType,
): Promise<Hash> {
	try {
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: transactionValidatorAbi,
			functionName: "recordTransaction",
			args: [agent, txHash, amount, txType],
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
		throw new QovaError("Failed to record transaction", "WRITE_FAILED", error);
	}
}

/**
 * Get aggregate transaction statistics for an agent.
 * @param client - viem PublicClient.
 * @param contractAddress - TransactionValidator contract address.
 * @param agent - The agent address.
 * @returns TransactionStats with totalCount, totalVolume, successCount, lastActivityTimestamp.
 */
export async function getTransactionStats(
	client: PublicClient,
	contractAddress: Address,
	agent: Address,
): Promise<TransactionStats> {
	try {
		const result = await client.readContract({
			address: contractAddress,
			abi: transactionValidatorAbi,
			functionName: "getTransactionStats",
			args: [agent],
		});
		return {
			totalCount: Number(result.totalCount),
			totalVolume: BigInt(result.totalVolume),
			successCount: Number(result.successCount),
			lastActivityTimestamp: BigInt(result.lastActivityTimestamp),
		};
	} catch (error) {
		throw new QovaError("Failed to read transaction stats", "READ_FAILED", error);
	}
}
