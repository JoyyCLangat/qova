/**
 * ABI for the Qova QovaCore contract.
 *
 * Orchestrator that coordinates ReputationRegistry, TransactionValidator,
 * and BudgetEnforcer for unified agent financial operations.
 * Extracted from Foundry build output (out/QovaCore.sol/QovaCore.json).
 *
 * @see contracts/src/QovaCore.sol
 */
export const qovaCoreAbi = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_registry",
				type: "address",
				internalType: "address",
			},
			{
				name: "_validator",
				type: "address",
				internalType: "address",
			},
			{
				name: "_enforcer",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "nonpayable",
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
		name: "OPERATOR_ROLE",
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
		name: "budgetEnforcer",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract BudgetEnforcer",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "executeAgentAction",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
			{
				name: "txHash",
				type: "bytes32",
				internalType: "bytes32",
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "txType",
				type: "uint8",
				internalType: "enum TransactionValidator.TransactionType",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "getAgentBudgetStatus",
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
		name: "getAgentScore",
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
				type: "uint16",
				internalType: "uint16",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getAgentStats",
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
				type: "tuple",
				internalType: "struct TransactionValidator.TransactionStats",
				components: [
					{
						name: "totalCount",
						type: "uint64",
						internalType: "uint64",
					},
					{
						name: "totalVolume",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "successCount",
						type: "uint64",
						internalType: "uint64",
					},
					{
						name: "lastActivityTimestamp",
						type: "uint48",
						internalType: "uint48",
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
		name: "pause",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "paused",
		inputs: [],
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
		name: "reputationRegistry",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract ReputationRegistry",
			},
		],
		stateMutability: "view",
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
		name: "setBudgetEnforcer",
		inputs: [
			{
				name: "enforcer",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setReputationRegistry",
		inputs: [
			{
				name: "registry",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setTransactionValidator",
		inputs: [
			{
				name: "validator",
				type: "address",
				internalType: "address",
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
		type: "function",
		name: "transactionValidator",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract TransactionValidator",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "unpause",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "AgentActionExecuted",
		inputs: [
			{
				name: "agent",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "txHash",
				type: "bytes32",
				indexed: true,
				internalType: "bytes32",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "txType",
				type: "uint8",
				indexed: false,
				internalType: "enum TransactionValidator.TransactionType",
			},
			{
				name: "timestamp",
				type: "uint48",
				indexed: false,
				internalType: "uint48",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "ContractUpdated",
		inputs: [
			{
				name: "contractName",
				type: "string",
				indexed: false,
				internalType: "string",
			},
			{
				name: "oldAddress",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "newAddress",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Paused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address",
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
		name: "Unpaused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address",
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
		name: "BudgetCheckFailed",
		inputs: [],
	},
	{
		type: "error",
		name: "EnforcedPause",
		inputs: [],
	},
	{
		type: "error",
		name: "ExpectedPause",
		inputs: [],
	},
	{
		type: "error",
		name: "InvalidContract",
		inputs: [],
	},
	{
		type: "error",
		name: "ReentrancyGuardReentrantCall",
		inputs: [],
	},
] as const;
