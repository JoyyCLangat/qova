"use client"

import { useAccount, useChainId } from "wagmi"
import { baseSepolia } from "wagmi/chains"

interface WalletStatus {
  address: `0x${string}` | undefined
  isConnected: boolean
  isCorrectChain: boolean
  needsChainSwitch: boolean
}

export function useWalletStatus(): WalletStatus {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const isCorrectChain = chainId === baseSepolia.id

  return {
    address,
    isConnected,
    isCorrectChain,
    needsChainSwitch: isConnected && !isCorrectChain,
  }
}
