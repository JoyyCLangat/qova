# ADR-007: CRE Integration Architecture

**Date:** 2026-02-26
**Status:** Accepted
**Author:** Qova Engineering

## Context
Qova needs decentralized, tamper-proof computation for agent reputation scoring,
transaction monitoring, budget alerts, and on-demand verification. These computations
must run off-chain (for API enrichment and complex scoring logic) but write results
on-chain with cryptographic guarantees. Centralized oracles introduce single points
of failure and trust assumptions incompatible with Qova's design goals.

## Decision
Use Chainlink CRE (Compute Runtime Environment) to implement four decentralized
workflows that bridge off-chain computation with on-chain state:

1. **Reputation Oracle** (Cron trigger) -- periodic score computation
2. **Transaction Monitor** (EVM log trigger) -- real-time anomaly detection
3. **Budget Alert** (EVM log trigger) -- spend threshold notifications
4. **Agent Verify** (HTTP trigger) -- on-demand verification attestations

### Architecture

```
Qova Contracts (Base Sepolia)
  |
  +-- ReputationRegistry ---- read/write scores
  +-- TransactionValidator --- read stats, emit TransactionRecorded
  +-- BudgetEnforcer --------- read budgets, emit SpendRecorded
  +-- QovaReputationConsumer - receive CRE reports, forward to Registry
  |
CRE DON (Chainlink Network)
  |
  +-- reputation-oracle/ ----- Cron -> read chain + API -> compute -> write
  +-- transaction-monitor/ --- LogTrigger -> read + API -> alert
  +-- budget-alert/ ---------- LogTrigger -> read -> alert
  +-- agent-verify/ ---------- HTTP -> read chain + API -> respond
  |
Off-chain APIs
  +-- Scoring API (enrichment, anomaly detection, sanctions)
```

### Key Design Decisions

**Shared modules over duplication.** Common code (scoring algorithm, contract ABIs,
config schemas, constants) lives in `cre/shared/` and is imported by all workflows.
This ensures scoring consistency across the reputation oracle and agent verify paths.

**BFT consensus for HTTP calls.** All off-chain API calls use the CRE consensus
pattern (`sendRequest(runtime, fn, consensusIdenticalAggregation())`) so that DON
nodes independently fetch data and agree on results before proceeding.

**Report-based on-chain writes.** Score updates go through CRE's report mechanism
(`prepareReportRequest` -> `writeReport`) rather than direct contract calls, ensuring
the write is cryptographically signed by the DON.

**QovaReputationConsumer as receiver.** A dedicated consumer contract receives CRE
reports and forwards them to ReputationRegistry, providing replay protection and
access control (only the CRE forwarder can submit reports).

**Zod config schemas.** Each workflow validates its config with Zod at startup, catching
misconfigurations before any on-chain interactions.

## Alternatives Considered

### Direct Chainlink Functions
Simpler to set up but limited to single-request patterns. Cannot orchestrate multi-step
workflows (read chain -> call API -> compute -> write chain) within one invocation.

### Custom off-chain oracle
Full control but requires running and securing our own infrastructure. No BFT consensus
guarantees. Single point of failure.

### Chainlink Automation + VRF
Good for simple automation but lacks the programmable computation model needed for
complex scoring algorithms with external data enrichment.

## Consequences

### Positive
- Decentralized computation with BFT consensus guarantees
- Tamper-proof scoring -- no single node can manipulate results
- Shared scoring algorithm ensures consistency across workflows
- Event-driven architecture (log triggers) for real-time monitoring
- Clean separation: CRE handles compute, contracts handle state

### Negative
- CRE SDK is pre-1.0 (currently 1.1.2-alpha scope)
- WASM compilation step adds build complexity
- DON node costs for ongoing operation
- Consensus overhead increases latency vs. centralized computation

### Risks
- CRE SDK API may change before mainnet launch
- Mock API must be replaced with production scoring service before mainnet
- Report receiver contract needs CRE forwarder address at deployment time
