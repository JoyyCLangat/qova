"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { baseSepolia, base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import "@rainbow-me/rainbowkit/styles.css"

const config = getDefaultConfig({
  appName: "Qova Protocol",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "placeholder",
  chains: [baseSepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { resolvedTheme } = useTheme()

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
