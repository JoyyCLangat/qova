/**
 * @file shared/constants.ts
 * CRE workflow constants: chain selectors, contract addresses, scoring weights.
 */

import type { Address } from "viem";

/** CRE chain selector for Base Sepolia testnet */
export const BASE_SEPOLIA_CHAIN_SELECTOR = 10344971235874465080n;
export const BASE_SEPOLIA_SELECTOR_NAME = "ethereum-testnet-sepolia-base-1";

/** Deployed Qova contract addresses on Base Sepolia */
export const CONTRACTS = {
	ReputationRegistry: "0x0b2466b01E6d73A24D9C716A9072ED3923563fBB" as Address,
	TransactionValidator: "0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900" as Address,
	BudgetEnforcer: "0x271618781040dc358e4F6B66561b65A839b0C76E" as Address,
	QovaCore: "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a" as Address,
} as const;

/** Scoring algorithm weights -- must sum to 1.0 */
export const SCORE_WEIGHTS = {
	transactionVolume: 0.25,
	transactionCount: 0.2,
	successRate: 0.3,
	budgetCompliance: 0.15,
	accountAge: 0.1,
} as const;

/** Only write on-chain if score changes by >= this many points */
export const MIN_SCORE_CHANGE = 10;

/** Alert if score drops below this threshold */
export const CRITICAL_SCORE_THRESHOLD = 300;

/** Score bounds */
export const MIN_SCORE = 0;
export const MAX_SCORE = 1000;
