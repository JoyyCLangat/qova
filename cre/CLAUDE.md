# cre/ -- Chainlink CRE Workflows

## Overview
Chainlink CRE (Compute Runtime Environment) workflows for decentralized reputation
scoring, transaction monitoring, budget alerts, and agent verification.
Built with @chainlink/cre-sdk v1.1.2, TypeScript, Bun runtime.

## Workflows

### reputation-oracle/
- **Trigger:** CronCapability (configurable schedule)
- **Flow:** Fetch agents -> read on-chain data -> off-chain enrichment -> compute score -> write on-chain
- **Output:** Updated ReputationRegistry score snapshot via CRE report

### transaction-monitor/
- **Trigger:** EVMClient.logTrigger (TransactionRecorded events)
- **Flow:** Capture event -> read agent score -> anomaly check via API -> webhook alert
- **Output:** Anomaly alert webhook

### budget-alert/
- **Trigger:** EVMClient.logTrigger (SpendRecorded events)
- **Flow:** Capture event -> read budget status -> calculate utilization -> webhook alert
- **Output:** Budget threshold alert (75%+ utilization)

### agent-verify/
- **Trigger:** HTTPCapability (POST requests)
- **Flow:** Parse agent address -> read on-chain data -> sanctions check -> return attestation
- **Output:** JSON verification attestation with credit grade

## Shared Modules (shared/)
- `constants.ts` -- Chain selectors, contract addresses, scoring weights
- `contracts.ts` -- Minimal ABI fragments for CRE reads/writes
- `scoring.ts` -- Deterministic reputation scoring algorithm
- `types.ts` -- Zod config schemas for all workflows

## CRE SDK Patterns
- `Runner.newRunner<Config>({ configSchema })` -> `runner.run(initWorkflow)`
- `initWorkflow(config)` returns array of `cre.handler(trigger, handlerFn)`
- EVM reads: `evmClient.callContract(runtime, { call, blockNumber }).result()`
- HTTP consensus: `httpClient.sendRequest(runtime, fn, consensusIdenticalAggregation())(args).result()`
- On-chain writes: `runtime.report(prepareReportRequest(data)).result()` -> `evmClient.writeReport(runtime, { receiver, report })`
- Log triggers: `evmClient.logTrigger({ addresses, topics })`
- Chain selector resolved via `getNetwork({ chainFamily, chainSelectorName, isTestnet })`

## Commands
```bash
bun test                       # Run unit tests
bun run mock-api               # Start mock scoring API on :3001
bun run simulate:reputation    # CRE local simulation
bun run simulate:monitor
bun run simulate:budget
bun run simulate:verify
bun run check                  # Biome lint
```

## Testing
- 22 unit tests across 3 files (scoring, contracts, config)
- Mock API server for local development and simulation
- All workflows validated against CRE SDK v1.1.2 types
