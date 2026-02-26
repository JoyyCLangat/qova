/**
 * SDK client singleton -- initializes @qova/core client for API use.
 * @author Qova Engineering <eng@qova.cc>
 */

import { createQovaClient, type QovaClient } from "@qova/core";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

let clientInstance: QovaClient | null = null;

/**
 * Get or create the Qova SDK client.
 * Singleton -- one client per API process.
 * @returns The QovaClient instance.
 */
export function getQovaClient(): QovaClient {
	if (clientInstance) return clientInstance;

	const rpcUrl = process.env.RPC_URL || "https://sepolia.base.org";
	const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

	const config: Parameters<typeof createQovaClient>[0] = {
		chain: "base-sepolia",
		rpcUrl,
	};

	if (privateKey) {
		const account = privateKeyToAccount(privateKey as `0x${string}`);
		const walletClient = createWalletClient({
			account,
			chain: baseSepolia,
			transport: http(rpcUrl),
		});
		config.walletClient = walletClient;
	}

	clientInstance = createQovaClient(config);
	return clientInstance;
}

/**
 * Reset the client singleton. For testing only.
 */
export function resetClient(): void {
	clientInstance = null;
}
