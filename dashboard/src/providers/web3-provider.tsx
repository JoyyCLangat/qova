"use client"

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { base, type Chain } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import "@rainbow-me/rainbowkit/styles.css"

/** SKALE Europa Hub -- gasless L2 */
const skaleEuropa: Chain = {
  id: 2046399126,
  name: "SKALE Europa",
  nativeCurrency: { name: "sFUEL", symbol: "sFUEL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.skalenodes.com/v1/elated-tan-skat"] },
  },
  blockExplorers: {
    default: { name: "SKALE Explorer", url: "https://elated-tan-skat.explorer.mainnet.skalenodes.com" },
  },
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""

const config = projectId
  ? getDefaultConfig({
      appName: "Qova Protocol",
      projectId,
      chains: [base, skaleEuropa],
      ssr: true,
    })
  : null

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { resolvedTheme } = useTheme()

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
