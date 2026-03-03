"use client"

import { useAccount, useChainId } from "wagmi"
import { base } from "wagmi/chains"

interface WalletStatus {
	address: `0x${string}` | undefined
	isConnected: boolean
	isCorrectChain: boolean
	chainId: number | undefined
	needsChainSwitch: boolean
}

const DISCONNECTED: WalletStatus = {
	address: undefined,
	isConnected: false,
	isCorrectChain: false,
	chainId: undefined,
	needsChainSwitch: false,
}

export function useWalletStatus(): WalletStatus {
	if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
		return DISCONNECTED
	}

	const { address, isConnected } = useAccount()
	const chainId = useChainId()

	// Accept any configured chain (multi-chain support)
	const isCorrectChain = chainId === base.id

	return {
		address,
		isConnected,
		isCorrectChain,
		chainId,
		needsChainSwitch: isConnected && !isCorrectChain,
	}
}
