"use client"

import { Wallet as WalletIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

let ConnectButton: typeof import("@rainbow-me/rainbowkit").ConnectButton | null = null
try {
  // Only available when Web3Provider is active (projectId is set)
  ConnectButton = require("@rainbow-me/rainbowkit").ConnectButton
} catch {
  // WalletConnect not configured
}

export function HeaderWallet(): React.ReactElement {
  // If wagmi context is not available, show disabled button
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || !ConnectButton) {
    return (
      <Button variant="outline" size="sm" className="gap-2 opacity-50 cursor-not-allowed" disabled>
        <WalletIcon className="size-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    )
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, openAccountModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!connected) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={openConnectModal}
              className="gap-2"
            >
              <WalletIcon className="size-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={openChainModal}
              className="gap-2 text-destructive border-destructive/30"
            >
              <WalletIcon className="size-4" />
              Wrong network
            </Button>
          )
        }

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={openAccountModal}
            className="gap-2"
          >
            <span className="size-2 rounded-full bg-score-green shrink-0" />
            <span className="text-xs font-mono truncate max-w-[120px]">
              {account.displayName}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              {chain.name}
            </span>
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
