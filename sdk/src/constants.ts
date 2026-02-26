/**
 * @qova/core - Contract addresses and chain configuration
 * @author Qova Engineering <eng@qova.cc>
 */

/** Supported chain IDs */
export const CHAIN_IDS = {
  BASE_SEPOLIA: 84532,
  BASE_MAINNET: 8453,
} as const;

/** Deployed contract addresses per network */
export const CONTRACTS = {
  [CHAIN_IDS.BASE_SEPOLIA]: {
    ReputationRegistry: "0x0b2466b01E6d73A24D9C716A9072ED3923563fBB",
    TransactionValidator: "0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900",
    BudgetEnforcer: "0x271618781040dc358e4F6B66561b65A839b0C76E",
    QovaCore: "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a",
  },
} as const;

/** Default chain for development */
export const DEFAULT_CHAIN_ID = CHAIN_IDS.BASE_SEPOLIA;

/** Get contract addresses for a given chain */
export function getContracts(chainId: number): {
  ReputationRegistry: string;
  TransactionValidator: string;
  BudgetEnforcer: string;
  QovaCore: string;
} {
  const contracts = CONTRACTS[chainId as keyof typeof CONTRACTS];
  if (!contracts) {
    throw new Error(`No contracts deployed on chain ${chainId}`);
  }
  return contracts;
}

/** Block explorer URLs per chain */
export const BLOCK_EXPLORERS = {
  [CHAIN_IDS.BASE_SEPOLIA]: "https://sepolia.basescan.org",
  [CHAIN_IDS.BASE_MAINNET]: "https://basescan.org",
} as const;
