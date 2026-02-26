/**
 * ABI for the Qova BudgetEnforcer contract.
 *
 * Enforces per-agent spending limits (daily, monthly, per-transaction).
 * Extracted from Foundry build output (out/BudgetEnforcer.sol/BudgetEnforcer.json).
 *
 * @see contracts/src/BudgetEnforcer.sol
 */
export const budgetEnforcerAbi = [
	{
		type: "constructor",
		inputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "BUDGET_MANAGER_ROLE",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "DEFAULT_ADMIN_ROLE",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "checkBudget",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint128",
				internalType: "uint128",
			},
		],
		outputs: [
			{
				name: "allowed",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getBudgetStatus",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "status",
				type: "tuple",
				internalType: "struct BudgetEnforcer.BudgetStatus",
				components: [
					{
						name: "dailyRemaining",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "monthlyRemaining",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "perTxLimit",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "dailySpent",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "monthlySpent",
						type: "uint128",
						internalType: "uint128",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getRoleAdmin",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "grantRole",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "hasBudget",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "hasRole",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "recordSpend",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint128",
				internalType: "uint128",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "renounceRole",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				internalType: "bytes32",
			},
			{
				name: "callerConfirmation",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "revokeRole",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setBudget",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
			{
				name: "dailyLimit",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "monthlyLimit",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "perTxLimit",
				type: "uint128",
				internalType: "uint128",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "supportsInterface",
		inputs: [
			{
				name: "interfaceId",
				type: "bytes4",
				internalType: "bytes4",
			},
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "event",
		name: "BudgetSet",
		inputs: [
			{
				name: "agent",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "dailyLimit",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
			{
				name: "monthlyLimit",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
			{
				name: "perTxLimit",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleAdminChanged",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "previousAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "newAdminRole",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleGranted",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "RoleRevoked",
		inputs: [
			{
				name: "role",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "account",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "SpendRecorded",
		inputs: [
			{
				name: "agent",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
			{
				name: "dailyRemaining",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
			{
				name: "monthlyRemaining",
				type: "uint128",
				indexed: false,
				internalType: "uint128",
			},
		],
		anonymous: false,
	},
	{
		type: "error",
		name: "AccessControlBadConfirmation",
		inputs: [],
	},
	{
		type: "error",
		name: "AccessControlUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
			{
				name: "neededRole",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
	},
	{
		type: "error",
		name: "BudgetExceeded",
		inputs: [
			{
				name: "requested",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "available",
				type: "uint128",
				internalType: "uint128",
			},
		],
	},
	{
		type: "error",
		name: "DailyLimitReached",
		inputs: [
			{
				name: "requested",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "remaining",
				type: "uint128",
				internalType: "uint128",
			},
		],
	},
	{
		type: "error",
		name: "MonthlyLimitReached",
		inputs: [
			{
				name: "requested",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "remaining",
				type: "uint128",
				internalType: "uint128",
			},
		],
	},
	{
		type: "error",
		name: "NoBudgetSet",
		inputs: [],
	},
	{
		type: "error",
		name: "PerTxLimitReached",
		inputs: [
			{
				name: "requested",
				type: "uint128",
				internalType: "uint128",
			},
			{
				name: "limit",
				type: "uint128",
				internalType: "uint128",
			},
		],
	},
] as const;
