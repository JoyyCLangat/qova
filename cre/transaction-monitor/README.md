# Transaction Monitor Workflow

## Trigger
**EVM Log** -- fires on `TransactionRecorded` events from the TransactionValidator contract.

## Purpose
Monitors all agent transactions in real time. When a transaction event is detected,
reads the agent's current reputation score and runs an off-chain anomaly detection
check. If an anomaly is flagged, sends an alert to the configured webhook.

## Data Flow
1. EVM log trigger captures `TransactionRecorded(address, bytes32, uint256, uint8, uint48)` events
2. Read on-chain: current agent score from ReputationRegistry
3. HTTP consensus call: anomaly detection via Scoring API
4. If anomaly detected: POST alert to configured webhook URL

## Configuration
See `config.json` for Base Sepolia defaults. Key fields:
- `evm.chainSelectorName` -- Target chain
- `evm.transactionValidator` -- Contract emitting events
- `evm.reputationRegistry` -- For score lookups
- `scoringApiUrl` -- Anomaly detection API
- `alertWebhookUrl` -- (optional) Webhook for alert delivery

## Testing
```bash
bun test              # Unit tests
bun run simulate:monitor  # CRE local simulation
```
