# cre/ -- Chainlink CRE Workflows

## Overview
Chainlink Runtime Environment (CRE) workflows for decentralized computation.
Two workflows: reputation scoring and pre-transaction trust checks.

## Workflows
### reputation-workflow/
- Trigger: CronCapability (hourly) + HTTP webhook
- Steps: Fetch transaction data -> Compute weighted score -> Write on-chain
- Output: Updated QovaReputationRegistry score snapshot

### trust-check-workflow/
- Trigger: HTTP webhook (pre-transaction)
- Steps: Resolve agent identity -> Pull current score -> Apply policy -> Return signal
- Output: { approved: boolean, score: number, reason: string }

## CRE Patterns
- TypeScript with @chainlink/cre-sdk
- Trigger-and-callback model
- Capabilities: HTTPClient (off-chain API calls), EVMClient (on-chain reads/writes)
- All capability calls return Promises
- Operations run across DON nodes with BFT consensus
- Workflows compile to WASM via CRE CLI

## Commands
```bash
cre workflow build     # Compile to WASM
cre workflow simulate  # Run local simulation
cre workflow deploy    # Deploy to CRE network
```

## Testing
- Every workflow must pass `cre workflow simulate` before deployment
- Mock external API responses for deterministic tests
- Test both approval and rejection paths for trust checks
