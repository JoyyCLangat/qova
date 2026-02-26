# Agent Verify Workflow

## Trigger
**HTTP** -- external services POST a verification request with an agent address.

## Purpose
On-demand agent verification for third-party integrations. Reads on-chain reputation
data, transaction stats, and budget status, then runs a sanctions screening check
off-chain. Returns a verification attestation with a credit grade (AAA through D).

## Data Flow
1. HTTP trigger receives `{ "agent": "0x..." }` as JSON input
2. Read on-chain: `isRegistered`, `getScore`, `getTransactionStats`, `hasBudget`
3. HTTP consensus call: sanctions screening via Scoring API
4. Compute credit grade from score
5. Return JSON attestation with all verification details

## Credit Grades
| Score Range | Grade |
|-------------|-------|
| 950-1000    | AAA   |
| 900-949     | AA    |
| 850-899     | A     |
| 750-849     | BBB   |
| 650-749     | BB    |
| 550-649     | B     |
| 450-549     | CCC   |
| 350-449     | CC    |
| 250-349     | C     |
| 0-249       | D     |

## Configuration
See `config.json` for Base Sepolia defaults. Key fields:
- `evm.chainSelectorName` -- Target chain
- `evm.reputationRegistry` / `transactionValidator` / `budgetEnforcer` -- Contract addresses
- `sanctionsApiUrl` -- Sanctions screening API endpoint

## Testing
```bash
bun test              # Unit tests
bun run simulate:verify  # CRE local simulation
```
