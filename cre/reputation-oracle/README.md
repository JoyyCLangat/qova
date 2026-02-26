# Reputation Oracle Workflow

## Trigger
**Cron** -- runs on a configurable schedule (default: every 5 minutes on staging).

## Purpose
Reads agent data from Qova contracts on Base Sepolia, fetches off-chain enrichment
(sanctions check, external reputation scores), computes a weighted reputation score
via BFT consensus across DON nodes, and writes the result on-chain if the score
change exceeds the minimum threshold.

## Data Flow
1. Fetch registered agent addresses from Qova Scoring API
2. Read on-chain: `getAgentDetails`, `getTransactionStats`, `getSuccessRate`, `getBudgetStatus`
3. Fetch off-chain: sanctions status + external reputation score via HTTP consensus
4. Compute weighted score (volume 25%, count 20%, success rate 30%, budget 15%, age 10%)
5. If score delta >= MIN_SCORE_CHANGE: prepare CRE report and write on-chain via `writeReport`

## Configuration
See `config.json` for Base Sepolia defaults. Key fields:
- `schedule` -- Cron expression
- `evm.chainSelectorName` -- Target chain
- `evm.reputationRegistry` / `transactionValidator` / `budgetEnforcer` -- Contract addresses
- `scoringApiUrl` -- Off-chain enrichment API base URL

## Scoring Algorithm
See `shared/scoring.ts`. Hard gates: sanctioned agents always score 0. Zero-activity
agents score 0 (insufficient data). All others receive a weighted composite in [0, 1000].

## Testing
```bash
bun test              # Unit tests for scoring, ABI encoding, config
bun run simulate:reputation  # CRE local simulation
```
