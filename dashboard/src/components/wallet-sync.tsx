"use client";

import { useWalletSync } from "@/hooks/use-wallet-sync";

/** Invisible component that syncs wallet address to Convex. */
export function WalletSync(): null {
	useWalletSync();
	return null;
}
