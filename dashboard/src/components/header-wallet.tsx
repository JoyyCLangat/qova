"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wallet as WalletIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function HeaderWallet(): React.ReactElement {
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
