"use client"

import { useAccount, useChainId } from "wagmi"
import { SUPPORTED_CHAINS, getChain, type ChainConfig } from "@/lib/chains"

interface WalletStatus {
	address: `0x${string}` | undefined
	isConnected: boolean
	isCorrectChain: boolean
	chainId: number | undefined
	needsChainSwitch: boolean
	currentChain: ChainConfig | undefined
}

const DISCONNECTED: WalletStatus = {
	address: undefined,
	isConnected: false,
	isCorrectChain: false,
	chainId: undefined,
	needsChainSwitch: false,
	currentChain: undefined,
}

const SUPPORTED_IDS = new Set(SUPPORTED_CHAINS.map((c) => c.id))

export function useWalletStatus(): WalletStatus {
	if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
		return DISCONNECTED
	}

	const { address, isConnected } = useAccount()
	const chainId = useChainId()

	// Accept ANY chain in SUPPORTED_CHAINS (multi-chain)
	const isCorrectChain = SUPPORTED_IDS.has(chainId)
	const currentChain = getChain(chainId)

	return {
		address,
		isConnected,
		isCorrectChain,
		chainId,
		needsChainSwitch: isConnected && !isCorrectChain,
		currentChain,
	}
}
