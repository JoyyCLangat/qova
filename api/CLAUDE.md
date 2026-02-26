# api/ -- Qova API Service

## Overview
REST API built with Hono framework on Bun runtime.
NOT Express. NOT Fastify. Uses @qova/core SDK for all chain interactions.

## Architecture
- Entry: `src/index.ts` (Bun-native server)
- App: `src/app.ts` (Hono instance, middleware, route mounting)
- Routes: `src/routes/` (6 modules: health, agents, transactions, budgets, scores, verify)
- Middleware: `src/middleware/` (error handler, validation, cache)
- Services: `src/services/` (chain client, scoring algorithm, data enrichment)
- Types: `src/types/` (API response types, Hono env)
- Schemas: `src/schemas/` (Zod request/response schemas)

## Routes (21 endpoints)
### /api/agents (7)
- `GET /api/agents` -- List agents
- `GET /api/agents/:address` -- Enriched agent details
- `GET /api/agents/:address/score` -- Score + grade + color
- `GET /api/agents/:address/registered` -- Registration status
- `POST /api/agents/register` -- Register agent (write)
- `POST /api/agents/:address/score` -- Update score (write)
- `POST /api/agents/batch-scores` -- Batch update (write)

### /api/transactions (2)
- `GET /api/transactions/:address/stats` -- Enriched tx stats
- `POST /api/transactions/record` -- Record transaction (write)

### /api/budgets (4)
- `GET /api/budgets/:address` -- Enriched budget status
- `POST /api/budgets/:address/set` -- Set limits (write)
- `POST /api/budgets/:address/check` -- Check budget
- `POST /api/budgets/:address/spend` -- Record spend (write)

### /api/scores (5)
- `GET /api/scores/agents` -- Agent list (CRE-compatible)
- `POST /api/scores/enrich` -- Off-chain enrichment (CRE-compatible)
- `POST /api/scores/anomaly-check` -- Anomaly detection (CRE-compatible)
- `POST /api/scores/compute` -- Compute score from metrics
- `GET /api/scores/:address` -- Full score breakdown

### /api/verify (2)
- `POST /api/verify` -- Verify agent
- `POST /api/verify/sanctions` -- Sanctions screening

### /v1/* (CRE backward-compatible)
- `GET /v1/agents`, `POST /v1/enrich`, `POST /v1/anomaly-check`, `POST /v1/sanctions/check`, `POST /v1/webhook`

## Middleware Stack
1. CORS (localhost:3000, localhost:5173, qova.cc)
2. Logger (Hono built-in)
3. Pretty JSON (Hono built-in)
4. Error handler (SDK errors -> HTTP status codes)
5. Address validation (regex per-route)
6. Body validation (Zod per-route)

## Key Patterns
- AppEnv type (`src/types/env.ts`) for typed Hono context variables
- SDK errors map to HTTP codes: AgentNotRegistered->404, BudgetExceeded->422, Unauthorized->403, InvalidScore->400
- BigInt values serialized as strings in JSON responses
- In-memory TTL cache (30s) for read-heavy endpoints
- Scoring algorithm synced with cre/shared/scoring.ts (manual sync)
- All enrichment uses SDK utils (getGrade, formatWei, etc.) -- never manual

## Commands
```bash
bun run dev      # Start dev server (port 3000)
bun run test     # Run vitest (44 tests)
bun run build    # Compile TypeScript
```

## Test Coverage
- 10 test files, 44 tests
- Routes: health, agents, transactions, budgets, scores, verify
- Middleware: error handler, validation
- Services: scoring algorithm, enrichment
