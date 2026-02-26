import type {
	AgentDetailsResponse,
	BudgetResponse,
	ScoreBreakdownResponse,
	TxStatsResponse,
} from "./api";

export const SEED_AGENTS: AgentDetailsResponse[] = [
	{
		agent: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
		score: 967,
		grade: "AAA",
		gradeColor: "#22C55E",
		scoreFormatted: "0967",
		scorePercentage: 96.7,
		lastUpdated: new Date(Date.now() - 1800000).toISOString(),
		updateCount: 47,
		isRegistered: true,
		addressShort: "0x742d...bD18",
		explorerUrl: "https://sepolia.basescan.org/address/0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
	},
	{
		agent: "0x8Ba1f109551bD432803012645Ac136c89aFbEf99",
		score: 923,
		grade: "AA",
		gradeColor: "#22C55E",
		scoreFormatted: "0923",
		scorePercentage: 92.3,
		lastUpdated: new Date(Date.now() - 3600000).toISOString(),
		updateCount: 38,
		isRegistered: true,
		addressShort: "0x8Ba1...Ef99",
		explorerUrl: "https://sepolia.basescan.org/address/0x8Ba1f109551bD432803012645Ac136c89aFbEf99",
	},
	{
		agent: "0xaB5801a7D398351b8bE11C439e05C5B3259aeC9B",
		score: 863,
		grade: "A",
		gradeColor: "#22C55E",
		scoreFormatted: "0863",
		scorePercentage: 86.3,
		lastUpdated: new Date(Date.now() - 7200000).toISOString(),
		updateCount: 29,
		isRegistered: true,
		addressShort: "0xaB58...eC9B",
		explorerUrl: "https://sepolia.basescan.org/address/0xaB5801a7D398351b8bE11C439e05C5B3259aeC9B",
	},
	{
		agent: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
		score: 782,
		grade: "BBB",
		gradeColor: "#22C55E",
		scoreFormatted: "0782",
		scorePercentage: 78.2,
		lastUpdated: new Date(Date.now() - 14400000).toISOString(),
		updateCount: 22,
		isRegistered: true,
		addressShort: "0x1f98...F984",
		explorerUrl: "https://sepolia.basescan.org/address/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
	},
	{
		agent: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
		score: 671,
		grade: "BB",
		gradeColor: "#FACC15",
		scoreFormatted: "0671",
		scorePercentage: 67.1,
		lastUpdated: new Date(Date.now() - 28800000).toISOString(),
		updateCount: 15,
		isRegistered: true,
		addressShort: "0xdD87...2148",
		explorerUrl: "https://sepolia.basescan.org/address/0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
	},
	{
		agent: "0x583031D1113aD414F02576BD6afaBfb302140225",
		score: 558,
		grade: "B",
		gradeColor: "#FACC15",
		scoreFormatted: "0558",
		scorePercentage: 55.8,
		lastUpdated: new Date(Date.now() - 43200000).toISOString(),
		updateCount: 11,
		isRegistered: true,
		addressShort: "0x5830...0225",
		explorerUrl: "https://sepolia.basescan.org/address/0x583031D1113aD414F02576BD6afaBfb302140225",
	},
	{
		agent: "0x4B0897b0513FdBeEc7C469D9aF4fA6C0752aB94D",
		score: 467,
		grade: "CCC",
		gradeColor: "#FACC15",
		scoreFormatted: "0467",
		scorePercentage: 46.7,
		lastUpdated: new Date(Date.now() - 86400000).toISOString(),
		updateCount: 7,
		isRegistered: true,
		addressShort: "0x4B08...B94D",
		explorerUrl: "https://sepolia.basescan.org/address/0x4B0897b0513FdBeEc7C469D9aF4fA6C0752aB94D",
	},
	{
		agent: "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
		score: 187,
		grade: "D",
		gradeColor: "#EF4444",
		scoreFormatted: "0187",
		scorePercentage: 18.7,
		lastUpdated: new Date(Date.now() - 172800000).toISOString(),
		updateCount: 3,
		isRegistered: true,
		addressShort: "0xCA35...733c",
		explorerUrl: "https://sepolia.basescan.org/address/0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
	},
];

export function getSeedTxStats(address: string): TxStatsResponse {
	const agent = SEED_AGENTS.find((a) => a.agent === address) ?? SEED_AGENTS[0];
	const tier = agent.score >= 700 ? 3 : agent.score >= 400 ? 2 : 1;
	return {
		agent: agent.agent,
		addressShort: agent.addressShort,
		totalCount: tier * 52 + Math.floor(agent.score / 10),
		totalVolume: `${(tier * 15.2 + agent.score / 100).toFixed(4)} ETH`,
		totalVolumeWei: `${BigInt(Math.floor((tier * 15.2 + agent.score / 100) * 1e18))}`,
		successRate: `${(90 + tier * 3).toFixed(2)}%`,
		successRateBps: (90 + tier * 3) * 100,
		lastActivity: agent.lastUpdated,
	};
}

export function getSeedBudget(address: string): BudgetResponse {
	const agent = SEED_AGENTS.find((a) => a.agent === address) ?? SEED_AGENTS[0];
	const dailyUsed = 32 + Math.floor(agent.score / 30);
	return {
		agent: agent.agent,
		config: {
			dailyLimit: "10.0000 ETH",
			monthlyLimit: "100.0000 ETH",
			perTxLimit: "5.0000 ETH",
		},
		usage: {
			dailySpent: `${(dailyUsed / 10).toFixed(4)} ETH`,
			monthlySpent: `${(dailyUsed * 3.2).toFixed(4)} ETH`,
			dailyRemaining: `${(10 - dailyUsed / 10).toFixed(4)} ETH`,
			monthlyRemaining: `${(100 - dailyUsed * 3.2).toFixed(4)} ETH`,
		},
		utilization: {
			daily: `${dailyUsed.toFixed(2)}%`,
			monthly: `${(dailyUsed * 0.32).toFixed(2)}%`,
		},
		raw: {
			dailyLimit: "10000000000000000000",
			monthlyLimit: "100000000000000000000",
			perTxLimit: "5000000000000000000",
			dailySpent: `${BigInt(Math.floor((dailyUsed / 10) * 1e18))}`,
			monthlySpent: `${BigInt(Math.floor(dailyUsed * 3.2 * 1e18))}`,
			dailyRemaining: `${BigInt(Math.floor((10 - dailyUsed / 10) * 1e18))}`,
			monthlyRemaining: `${BigInt(Math.floor((100 - dailyUsed * 3.2) * 1e18))}`,
		},
	};
}

export function getSeedBreakdown(address: string): ScoreBreakdownResponse {
	const agent = SEED_AGENTS.find((a) => a.agent === address) ?? SEED_AGENTS[0];
	const base = agent.score / 1000;
	return {
		agent: agent.agent,
		score: agent.score,
		grade: agent.grade,
		gradeColor: agent.gradeColor,
		factors: {
			transactionVolume: {
				raw: `${(base * 45).toFixed(4)} ETH`,
				normalized: Math.round(base * 0.9 * 1000) / 1000,
				weight: 0.2,
				contribution: Math.round(base * 0.9 * 200),
			},
			transactionCount: {
				raw: Math.floor(base * 500),
				normalized: Math.round(base * 0.85 * 1000) / 1000,
				weight: 0.15,
				contribution: Math.round(base * 0.85 * 150),
			},
			successRate: {
				raw: `${(90 + base * 9).toFixed(2)}%`,
				normalized: Math.round((0.9 + base * 0.1) * 1000) / 1000,
				weight: 0.3,
				contribution: Math.round((0.9 + base * 0.1) * 300),
			},
			budgetCompliance: {
				raw: `${(base * 32).toFixed(0)}% utilized`,
				normalized: Math.round(Math.min(1, base + 0.1) * 1000) / 1000,
				weight: 0.15,
				contribution: Math.round(Math.min(1, base + 0.1) * 150),
			},
			accountAge: {
				raw: `${Math.floor(base * 365)} days`,
				normalized: Math.round(base * 1000) / 1000,
				weight: 0.2,
				contribution: Math.round(base * 200),
			},
		},
		timestamp: new Date().toISOString(),
	};
}

export const SEED_ACTIVITY = [
	{
		agent: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
		addressShort: "0x742d...bD18",
		type: "Payment",
		amount: "2.5 ETH",
		time: new Date(Date.now() - 120000).toISOString(),
	},
	{
		agent: "0x8Ba1f109551bD432803012645Ac136c89aFbEf99",
		addressShort: "0x8Ba1...Ef99",
		type: "Swap",
		amount: "0.8 ETH",
		time: new Date(Date.now() - 300000).toISOString(),
	},
	{
		agent: "0xaB5801a7D398351b8bE11C439e05C5B3259aeC9B",
		addressShort: "0xaB58...eC9B",
		type: "Transfer",
		amount: "1.2 ETH",
		time: new Date(Date.now() - 600000).toISOString(),
	},
	{
		agent: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
		addressShort: "0x1f98...F984",
		type: "Payment",
		amount: "0.35 ETH",
		time: new Date(Date.now() - 900000).toISOString(),
	},
	{
		agent: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
		addressShort: "0xdD87...2148",
		type: "Stake",
		amount: "5.0 ETH",
		time: new Date(Date.now() - 1800000).toISOString(),
	},
	{
		agent: "0x583031D1113aD414F02576BD6afaBfb302140225",
		addressShort: "0x5830...0225",
		type: "Swap",
		amount: "0.15 ETH",
		time: new Date(Date.now() - 3600000).toISOString(),
	},
];
