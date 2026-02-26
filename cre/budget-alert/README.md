# Budget Alert Workflow

## Trigger
**EVM Log** -- fires on `SpendRecorded` events from the BudgetEnforcer contract.

## Purpose
Monitors agent spend events in real time. When a spend is recorded, reads the agent's
current budget status and calculates utilization. If utilization exceeds 75%, sends
an alert to the configured webhook.

## Data Flow
1. EVM log trigger captures `SpendRecorded(address, uint128, uint128, uint48)` events
2. Read on-chain: `getBudgetStatus` from BudgetEnforcer
3. Calculate daily utilization: `spent / (spent + remaining)`
4. If utilization >= 75%: POST alert to webhook with severity level

## Alert Levels
- **WARNING** (75-99%): Agent approaching daily budget limit
- **CRITICAL** (100%+): Agent has exceeded daily budget

## Configuration
See `config.json` for Base Sepolia defaults. Key fields:
- `evm.chainSelectorName` -- Target chain
- `evm.budgetEnforcer` -- Contract emitting events
- `alertWebhookUrl` -- Webhook endpoint (required)

## Testing
```bash
bun test              # Unit tests
bun run simulate:budget  # CRE local simulation
```
