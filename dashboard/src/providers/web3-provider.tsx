"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { baseSepolia, base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import "@rainbow-me/rainbowkit/styles.css"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""
const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === "8453"

const config = projectId
  ? getDefaultConfig({
      appName: "Qova Protocol",
      projectId,
      chains: isProd ? [base] : [baseSepolia],
      ssr: true,
    })
  : null

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { resolvedTheme } = useTheme()

  // If no WalletConnect project ID, skip wallet provider entirely
  if (!config) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={resolvedTheme === "dark" ? darkTheme({
            accentColor: "#1A1A1A",
            borderRadius: "medium",
          }) : lightTheme({
            accentColor: "#1A1A1A",
            borderRadius: "medium",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
