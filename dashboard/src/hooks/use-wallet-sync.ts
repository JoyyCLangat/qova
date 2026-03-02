"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWalletStatus } from "./use-wallet-status";

/**
 * Syncs the connected wallet address to the Convex user record.
 * Call this once in the dashboard layout so it fires on every
 * wallet connect/disconnect event.
 */
export function useWalletSync(): void {
	const { address, isConnected } = useWalletStatus();
	const linkWallet = useMutation(api.mutations.users.linkWallet);
	const lastSynced = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (!isConnected || !address) return;
		if (address === lastSynced.current) return;

		lastSynced.current = address;
		linkWallet({ walletAddress: address }).catch(() => {
			// Silently fail -- user might not have a Convex user record yet
		});
	}, [address, isConnected, linkWallet]);
}
