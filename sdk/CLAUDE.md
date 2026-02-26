# sdk/ -- @qova/core SDK

## Overview
TypeScript SDK for interacting with Qova protocol. Published as `@qova/core`.
Framework-agnostic, tree-shakeable, zero-config defaults.

## Modules
- `types.ts` -- Core types, Zod schemas, Result pattern
- `wallet.ts` -- Coinbase CDP wallet wrapper with budget enforcement
- `identity.ts` -- Agent identity registration and resolution
- `reputation.ts` -- Score queries, feedback submission
- `facilitator.ts` -- x402 payment integration
- `budget.ts` -- Spending limits and policy enforcement

## Conventions
- Strict TypeScript, ESM only, no CommonJS
- All functions have explicit return types
- Result<T, E> pattern for expected errors (not try/catch)
- Zod for all runtime validation
- viem for blockchain interaction (NEVER ethers.js)
- JSDoc on all exported functions and types
- No `any` type -- use `unknown` and narrow

## Commands
```bash
bun run build    # Compile to dist/
bun run test     # Run vitest
```

## Tree Shaking
- Named exports only (no default exports)
- Side-effect-free modules
- package.json "exports" field with subpath patterns
