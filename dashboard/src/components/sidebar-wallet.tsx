"use client"

import { Wallet as WalletIcon } from "@phosphor-icons/react"

let ConnectButton: typeof import("@rainbow-me/rainbowkit").ConnectButton | null = null
try {
  ConnectButton = require("@rainbow-me/rainbowkit").ConnectButton
} catch {
  // WalletConnect not configured
}

export function SidebarWallet(): React.ReactElement {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || !ConnectButton) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] opacity-50 cursor-not-allowed rounded-lg"
      >
        <WalletIcon className="size-4" />
        Connect Wallet
      </button>
    )
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, openAccountModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar-active)] rounded-lg transition-colors"
            >
              <WalletIcon className="size-4" />
              Connect Wallet
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--status-red-text)] hover:bg-[var(--bg-sidebar-active)] rounded-lg transition-colors"
            >
              <WalletIcon className="size-4" />
              Wrong network
            </button>
          )
        }

        return (
          <button
            onClick={openAccountModal}
            type="button"
            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[var(--bg-sidebar-active)] rounded-lg transition-colors"
          >
            <span className="size-2 rounded-full bg-[var(--status-green-text)] shrink-0" />
            <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
              {account.displayName}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] ml-auto shrink-0">
              {chain.name}
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
