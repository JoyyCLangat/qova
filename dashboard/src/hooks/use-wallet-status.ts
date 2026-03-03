"use client"

interface WalletStatus {
	address: `0x${string}` | undefined
	isConnected: boolean
	isCorrectChain: boolean
	needsChainSwitch: boolean
}

const DISCONNECTED: WalletStatus = {
	address: undefined,
	isConnected: false,
	isCorrectChain: false,
	needsChainSwitch: false,
}

export function useWalletStatus(): WalletStatus {
	// If WalletConnect is not configured, return disconnected state
	if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
		return DISCONNECTED
	}

	try {
		// Dynamic import to avoid crashes when WagmiProvider is absent
		const { useAccount, useChainId } = require("wagmi")
		const { baseSepolia, base } = require("wagmi/chains")

		const expectedChainId =
			process.env.NEXT_PUBLIC_CHAIN_ID === "8453" ? base.id : baseSepolia.id

		const { address, isConnected } = useAccount()
		const chainId = useChainId()
		const isCorrectChain = chainId === expectedChainId

		return {
			address,
			isConnected,
			isCorrectChain,
			needsChainSwitch: isConnected && !isCorrectChain,
		}
	} catch {
		return DISCONNECTED
	}
}
