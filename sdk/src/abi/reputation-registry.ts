/**
 * ABI for the Qova ReputationRegistry contract.
 *
 * Manages agent registration and on-chain reputation scores.
 * Extracted from Foundry build output (out/ReputationRegistry.sol/ReputationRegistry.json).
 *
 * @see contracts/src/ReputationRegistry.sol
 */
export const reputationRegistryAbi = [
	{
		type: "constructor",
		inputs: [],
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
		name: "UPDATER_ROLE",
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
		name: "batchUpdateScores",
		inputs: [
			{
				name: "agents",
				type: "address[]",
				internalType: "address[]",
			},
			{
				name: "scores",
				type: "uint16[]",
				internalType: "uint16[]",
			},
			{
				name: "reasons",
				type: "bytes32[]",
				internalType: "bytes32[]",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "getAgentDetails",
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
				internalType: "struct ReputationRegistry.AgentDetails",
				components: [
					{
						name: "score",
						type: "uint16",
						internalType: "uint16",
					},
					{
						name: "lastUpdated",
						type: "uint48",
						internalType: "uint48",
					},
					{
						name: "updateCount",
						type: "uint32",
						internalType: "uint32",
					},
					{
						name: "registered",
						type: "bool",
						internalType: "bool",
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
		name: "getScore",
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
		name: "isRegistered",
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
		name: "registerAgent",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
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
		name: "unpause",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateScore",
		inputs: [
			{
				name: "agent",
				type: "address",
				internalType: "address",
			},
			{
				name: "newScore",
				type: "uint16",
				internalType: "uint16",
			},
			{
				name: "reason",
				type: "bytes32",
				internalType: "bytes32",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "AgentRegistered",
		inputs: [
			{
				name: "agent",
				type: "address",
				indexed: true,
				internalType: "address",
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
		name: "ScoreUpdated",
		inputs: [
			{
				name: "agent",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "oldScore",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newScore",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "reason",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32",
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
		name: "AgentAlreadyRegistered",
		inputs: [],
	},
	{
		type: "error",
		name: "AgentNotRegistered",
		inputs: [],
	},
	{
		type: "error",
		name: "ArrayLengthMismatch",
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
		name: "InvalidScore",
		inputs: [],
	},
] as const;
