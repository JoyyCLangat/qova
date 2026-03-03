# ADR-006: Base Sepolia Testnet Deployment

## Status
Accepted

## Date
2026-02-26

## Context
Phase 1 smart contracts (ReputationRegistry, TransactionValidator, BudgetEnforcer, QovaCore) were complete with 35 passing unit/fuzz tests and a full integration test. The contracts needed to be deployed to a public testnet to enable SDK integration, API development, and hackathon submission requirements.

## Decision
Deploy all four contracts to **Base Sepolia** (Chain ID 84532) using Foundry's `forge script` with broadcast mode. Base Sepolia was chosen because:

1. Base L2 is the target production chain per the architecture plan
2. Base Sepolia provides free testnet ETH via multiple faucets
3. Basescan verification is available for source code transparency
4. EVM Cancun features (used by Solidity 0.8.28) are supported

## Deployment Details

| Contract | Address |
|---|---|
| ReputationRegistry | `0x0b2466b01E6d73A24D9C716A9072ED3923563fBB` |
| TransactionValidator | `0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900` |
| BudgetEnforcer | `0x271618781040dc358e4F6B66561b65A839b0C76E` |
| QovaCore | `0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a` |

**Deployer**: `0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158`
**Total deployment cost**: ~0.000055 ETH (7 transactions: 4 creates + 3 role grants)

### Role Grants
- QovaCore granted `UPDATER_ROLE` on ReputationRegistry
- QovaCore granted `RECORDER_ROLE` on TransactionValidator
- QovaCore granted `BUDGET_MANAGER_ROLE` on BudgetEnforcer

All role grants verified on-chain via `cast call`.

## Consequences

### Positive
- SDK can now target real deployed contracts for integration testing
- Hackathon submission requirement for Base Sepolia deployment is satisfied
- On-chain verification confirms correct role wiring between contracts
- Deployment record stored in `contracts/deployments/base-sepolia.json`

### Negative
- Testnet contracts are not upgradeable; redeployment needed for contract changes
- No source verification on Basescan yet (optional, requires API key)

### Risks
- Testnet may reset, requiring redeployment
- Deployer key is a dedicated testnet-only wallet with no mainnet funds
