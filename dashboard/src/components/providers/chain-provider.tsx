"use client"

import { createContext, useCallback, useContext, useState } from "react"

interface ChainContextValue {
	/** Currently selected chain ID. 0 means "All Chains". */
	selectedChainId: number
	setSelectedChainId: (chainId: number) => void
}

const ChainContext = createContext<ChainContextValue>({
	selectedChainId: 0,
	setSelectedChainId: () => {},
})

export function ChainProvider({
	children,
}: { children: React.ReactNode }): React.ReactElement {
	const [selectedChainId, setSelectedChainIdRaw] = useState(0)

	const setSelectedChainId = useCallback((chainId: number) => {
		setSelectedChainIdRaw(chainId)
	}, [])

	return (
		<ChainContext.Provider value={{ selectedChainId, setSelectedChainId }}>
			{children}
		</ChainContext.Provider>
	)
}

/** Get the global chain filter. Returns 0 for "All Chains". */
export function useChainFilter(): ChainContextValue {
	return useContext(ChainContext)
}
