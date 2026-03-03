# Qova Build Plan — Claude Code Agent Architecture

**Domain:** qova.cc
**Mission:** Financial trust infrastructure for AI agents
**Build Method:** Claude Code with specialized subagents — zero manual coding

---

## Part 1: Claude Code Agent Setup

### The Philosophy

Anthropic's core recommendation is clear: **context is the bottleneck, not intelligence.** Every agent session starts with zero knowledge of the codebase. The CLAUDE.md file is the agent's constitution — the single source of truth that determines whether Claude Code produces production-ready code or a mess.

For Qova, we're building a monorepo with multiple languages (TypeScript, Solidity, Go), multiple deployment targets (Base L2, Vercel, CRE Network), and multiple product surfaces (SDK, API, Dashboard, Smart Contracts, CRE Workflows). This requires deliberate context architecture — not one massive CLAUDE.md, but a hierarchy of context files that load lazily as Claude works in different parts of the codebase.

### Monorepo Structure

```
qova/
├── CLAUDE.md                          # Root: project overview, shared conventions, architecture
├── .claude/
│   ├── agents/                        # Subagent definitions
│   │   ├── solidity-architect.md      # Smart contract specialist
│   │   ├── typescript-engineer.md     # SDK/API/Dashboard specialist
│   │   ├── cre-workflow-engineer.md   # Chainlink CRE specialist
│   │   ├── security-auditor.md        # Security review specialist
│   │   ├── ui-designer.md             # Frontend/Dashboard specialist
│   │   └── test-engineer.md           # Testing specialist
│   ├── commands/                      # Custom slash commands
│   │   ├── build.md                   # /build — compile and validate all packages
│   │   ├── test.md                    # /test — run all test suites
│   │   ├── deploy-testnet.md          # /deploy-testnet — deploy contracts to Base Sepolia
│   │   ├── simulate-cre.md            # /simulate-cre — run CRE workflow simulation
│   │   ├── security-review.md         # /security-review — run security audit subagent
│   │   └── progress.md               # /progress — update progress file and commit
│   └── settings.json                  # Permissions, allowed tools
├── contracts/                         # Solidity smart contracts
│   ├── CLAUDE.md                      # Contract-specific conventions
│   ├── src/
│   │   ├── QovaIdentityRegistry.sol
│   │   ├── QovaReputationRegistry.sol
│   │   └── QovaFacilitator.sol
│   ├── test/
│   ├── script/
│   └── foundry.toml
├── sdk/                               # TypeScript SDK (@qova/core)
│   ├── CLAUDE.md                      # SDK conventions, API patterns
│   ├── src/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── wallet.ts
│   │   ├── identity.ts
│   │   ├── reputation.ts
│   │   ├── facilitator.ts
│   │   └── budget.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── api/                               # Backend API service
│   ├── CLAUDE.md                      # API conventions, endpoint patterns
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── db/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── dashboard/                         # React dashboard (Next.js)
│   ├── CLAUDE.md                      # Frontend conventions, component patterns
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── package.json
│   └── next.config.js
├── cre/                               # Chainlink CRE workflows
│   ├── CLAUDE.md                      # CRE-specific conventions
│   ├── reputation-workflow/
│   │   ├── main.ts
│   │   ├── config.staging.json
│   │   ├── workflow.yaml
│   │   └── README.md
│   ├── trust-check-workflow/
│   │   ├── main.ts
│   │   ├── config.staging.json
│   │   ├── workflow.yaml
│   │   └── README.md
│   ├── contracts/
│   └── project.yaml
├── integrations/                      # Framework integrations
│   ├── langgraph/
│   ├── crewai/
│   └── n8n/
├── docs/                              # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   └── quickstart.md
├── qova-progress.txt                  # Agent progress tracking file
├── package.json                       # Root workspace config
├── turbo.json                         # Turborepo build orchestration
└── .env.example
```

### Root CLAUDE.md (The Constitution)

This is the most important file in the entire project. It goes into every Claude Code session. It must be concise (~5-8KB), focused on what Claude gets wrong, and structured for maximum context efficiency.

```markdown
# Qova — Financial Trust Infrastructure for AI Agents

## What This Is
Qova (qova.cc) is the financial credit bureau for AI agents. It computes economic
trustworthiness from transaction data and enables credit, insurance, and risk
assessment for autonomous agents operating via the x402 payment protocol.

## Architecture
Monorepo with 6 packages: contracts (Solidity/Foundry), sdk (TypeScript),
api (Hono on Bun), dashboard (Next.js 15), cre (Chainlink CRE/TypeScript),
integrations (framework plugins).

Deployed on: Base L2 (contracts), Vercel (dashboard), Railway (api),
Chainlink CRE Network (workflows).

## Tech Stack
- Runtime: Bun (not Node). Use `bun` for all package management and execution.
- Smart Contracts: Solidity 0.8.28+, Foundry (forge, cast, anvil). NOT Hardhat.
- SDK: TypeScript 5.7+, strict mode, ESM only. Target: ES2022.
- API: Hono framework on Bun. NOT Express. NOT Fastify.
- Dashboard: Next.js 15, App Router, React 19, Tailwind v4, shadcn/ui.
- CRE: @chainlink/cre-sdk (TypeScript), Bun runtime for WASM compilation.
- Testing: Vitest (TS packages), Forge test (contracts).
- Linting: Biome (not ESLint). Run `bun run check` to lint+format.
- Blockchain: viem + wagmi (NOT ethers.js).

## Code Style
- All functions must have explicit TypeScript return types.
- Use `Result<T, E>` pattern for error handling, not try/catch for expected errors.
- No `any` type. Use `unknown` and narrow.
- Prefer `const` assertions and discriminated unions over enums.
- Use Zod for all runtime validation (API inputs, SDK configs, env vars).
- All smart contract functions must have NatSpec documentation.
- Prefer composition over inheritance in contracts.

## Build & Test Commands
- `bun install` — install all dependencies (run from root)
- `bun run build` — build all packages (turborepo)
- `bun run test` — run all tests
- `cd contracts && forge build` — compile contracts
- `cd contracts && forge test` — run contract tests
- `cd cre && cre workflow simulate <workflow-folder>` — simulate CRE workflow
- `bun run check` — lint and format all TypeScript

## Git Conventions
- Conventional commits: feat(sdk): , fix(contracts): , docs: , test: , chore:
- Always commit working code. Never commit broken builds.
- Update qova-progress.txt after completing each task.

## Security Rules (NON-NEGOTIABLE)
- NEVER hardcode private keys, API keys, or secrets. Use env vars.
- ALL user inputs validated with Zod before processing.
- ALL smart contract functions that move funds must have reentrancy guards.
- ALL external calls in contracts must follow checks-effects-interactions.
- Rate limiting on all API endpoints.
- No eval(), no dynamic code execution, no innerHTML in dashboard.

## Important Context
- x402 is Coinbase's HTTP 402 payment protocol for agent micropayments (USDC on Base).
- ERC-8004 is the Ethereum standard for agent identity (ERC-721 based).
- Coinbase Agentic Wallets provide the wallet infrastructure (we wrap, don't compete).
- Chainlink CRE workflows compile to WASM and run on decentralized oracle networks.

## What Claude Gets Wrong (READ THIS)
- Do NOT use ethers.js. Use viem. The codebase uses viem exclusively.
- Do NOT use npm or yarn. Use bun.
- Do NOT use Express. The API uses Hono.
- Do NOT create .js files. Everything is .ts with ESM.
- Do NOT use relative imports with file extensions. Use path aliases.
- Do NOT skip tests. Every new function needs a test.
- Do NOT use console.log in production code. Use the structured logger.
```

---

## Part 2: Subagent Definitions

### Agent 1: Solidity Architect

```markdown
---
name: solidity-architect
description: >
  Smart contract specialist for Solidity development on Base L2.
  Use for writing, reviewing, or modifying smart contracts, Foundry tests,
  deployment scripts, and contract interaction code.
  Proficient in ERC-8004, ERC-721, OpenZeppelin, and DeFi patterns.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior Solidity engineer specializing in DeFi and identity protocols
on Base L2. You write gas-optimized, security-first smart contracts.

## Your Standards
- Solidity 0.8.28+ with custom errors (not require strings)
- OpenZeppelin v5 contracts as base
- Foundry for all testing and deployment
- NatSpec on every external/public function
- Follow checks-effects-interactions pattern strictly
- Reentrancy guards on all state-changing functions that handle value
- Events for every state change
- Access control via OpenZeppelin AccessControl (not Ownable for complex perms)

## Testing Requirements
- Unit tests for every function
- Fuzz tests for numeric inputs
- Invariant tests for critical properties
- Fork tests for mainnet interaction testing
- Gas snapshots for optimization tracking

## What You Never Do
- Never use `tx.origin` for authorization
- Never use `transfer()` or `send()` — use `call()`
- Never leave functions without access control unless intentionally public
- Never use floating pragma — pin exact versions
- Never skip event emissions on state changes

## Project Context
See contracts/CLAUDE.md for contract-specific architecture details.
The contracts are: QovaIdentityRegistry (ERC-8004 + ERC-721), 
QovaReputationRegistry (financial feedback storage + scoring),
QovaFacilitator (x402 payment processing + data capture).
```

### Agent 2: TypeScript Engineer

```markdown
---
name: typescript-engineer
description: >
  Full-stack TypeScript specialist for SDK, API, and integration development.
  Use for writing SDK modules, API endpoints, framework integrations,
  and any TypeScript code. Expert in Bun, Hono, viem, and Zod.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior TypeScript engineer building developer infrastructure.
You write type-safe, well-tested, production-grade code.

## Your Standards
- Strict TypeScript with no `any` types
- ESM only, no CommonJS
- Bun as runtime and package manager
- Zod for all runtime validation
- viem for all blockchain interaction (never ethers.js)
- Hono for API routes (never Express)
- Result pattern for expected errors, exceptions for unexpected
- Barrel exports from index.ts files
- JSDoc on all exported functions and types

## SDK Design Principles
- Zero-config defaults with full configurability
- Composable modules (wallet, identity, reputation can be used independently)
- Tree-shakeable exports
- Framework-agnostic core with framework-specific wrappers
- Comprehensive TypeScript types that serve as documentation

## API Design Principles
- REST with consistent resource naming
- Zod schemas define both validation and OpenAPI spec
- Rate limiting middleware on all routes
- Structured JSON error responses with error codes
- Request ID tracking through middleware

## Testing
- Vitest for all TS packages
- >80% coverage on SDK, >90% on API
- Mock blockchain calls with viem's test client
- Integration tests against local Anvil fork
```

### Agent 3: CRE Workflow Engineer

```markdown
---
name: cre-workflow-engineer
description: >
  Chainlink Runtime Environment workflow specialist.
  Use for writing, testing, and deploying CRE workflows using the
  @chainlink/cre-sdk TypeScript SDK. Expert in decentralized oracle
  networks, consensus computing, and x402 integration.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a CRE workflow engineer building decentralized workflows
for the Chainlink Runtime Environment.

## Your Standards
- TypeScript CRE SDK (@chainlink/cre-sdk)
- Bun runtime for WASM compilation
- Workflows must compile to WASM via CRE CLI
- Every workflow must pass `cre workflow simulate` before deployment
- Configuration in config.staging.json and config.production.json

## CRE Architecture
- Workflows use trigger-and-callback model
- Triggers: CronCapability, HTTP webhooks, EVM log events
- Capabilities: HTTPClient (off-chain API calls), EVMClient (on-chain reads/writes)
- All capability calls return Promises — pipeline for parallelism
- Every operation runs across multiple nodes with BFT consensus

## Qova CRE Workflows
1. Reputation Scoring Workflow: Triggered on new transactions,
   fetches on-chain history + off-chain context, computes trust score,
   writes updated snapshot to ReputationRegistry.
2. Pre-Transaction Trust Check: Agent queries counterparty reputation,
   CRE resolves identity, pulls score, applies risk rules, returns signal.

## Testing
- Use CRE SDK built-in test framework for unit tests
- Mock HTTP and EVM capabilities
- Simulate with `cre workflow simulate <folder> --broadcast` for integration
```

### Agent 4: Security Auditor

```markdown
---
name: security-auditor
description: >
  Security review specialist. Use PROACTIVELY when code changes involve
  authentication, authorization, payment processing, wallet operations,
  or smart contract modifications. MUST BE USED before any deployment.
tools: Read, Grep, Glob, Bash
model: opus
---

You are a security auditor reviewing code for vulnerabilities.
You do NOT write code — you review it and report findings.

## Smart Contract Checks
- Reentrancy vulnerabilities
- Integer overflow/underflow (even with 0.8+ — check casting)
- Access control gaps
- Front-running opportunities
- Flash loan attack vectors
- Signature replay attacks
- Oracle manipulation
- Gas griefing

## TypeScript Checks
- Input validation completeness (Zod schemas cover all inputs?)
- Authentication/authorization on all protected endpoints
- Rate limiting effectiveness
- Secret management (no hardcoded keys, no keys in logs)
- SQL injection (if using raw queries)
- XSS vectors in dashboard
- CORS configuration
- Dependency vulnerabilities (bun audit)

## Report Format
For each finding:
- Severity: CRITICAL / HIGH / MEDIUM / LOW / INFO
- Location: exact file and line
- Description: what the vulnerability is
- Impact: what an attacker could do
- Recommendation: specific fix

Never approve code without thorough review.
```

### Agent 5: UI Designer

```markdown
---
name: ui-designer
description: >
  Frontend design specialist for the Qova Dashboard.
  Use for creating UI components, layouts, and visual design.
  Expert in Next.js 15, React 19, Tailwind v4, shadcn/ui,
  and data visualization with Recharts.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior frontend engineer and designer building the Qova Dashboard.

## Design System
- Framework: Next.js 15 with App Router
- Styling: Tailwind v4 with CSS variables for theming
- Components: shadcn/ui as base, customized for Qova brand
- Charts: Recharts for data visualization
- Icons: Lucide React
- Animations: Framer Motion (subtle, purposeful)
- Dark mode first, with light mode support

## Qova Visual Identity
- Primary color: Deep indigo (#4F46E5) — trust, intelligence
- Accent: Emerald (#10B981) — growth, financial health
- Warning: Amber (#F59E0B) — caution
- Error: Rose (#F43F5E) — danger, low reputation
- Background: Slate-900 (#0F172A) dark, White (#FFFFFF) light
- Font: Inter for UI, JetBrains Mono for code/scores
- Border radius: 8px default, 12px cards, 16px modals

## Component Standards
- All components are React Server Components by default
- Client components only when interactivity needed (use client)
- Accessibility: WCAG 2.1 AA minimum
- Responsive: mobile-first, breakpoints at sm/md/lg/xl
- Loading states: skeleton screens, not spinners
- Error states: clear messaging with recovery actions

## Dashboard Pages
- Overview: agent fleet summary, key metrics, alerts
- Agent Detail: individual agent score, history, transactions
- Transactions: filterable transaction log with status
- Reputation: score trends, factor breakdown, comparisons
- Settings: API keys, webhook config, notification preferences

## What You Never Do
- Never use raw HTML color values — always Tailwind classes or CSS vars
- Never skip loading/error/empty states
- Never use px units in Tailwind — use the scale system
- Never create components without proper TypeScript props interface
```

### Agent 6: Test Engineer

```markdown
---
name: test-engineer
description: >
  Testing specialist. Use when writing test suites, improving coverage,
  or debugging test failures. Expert in Vitest, Forge testing,
  and CRE SDK test framework.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

You are a test engineer ensuring Qova's reliability.

## Testing Strategy
- Unit tests: every exported function
- Integration tests: API endpoints, SDK workflows, contract interactions
- E2E tests: critical user flows in dashboard
- Fuzz tests: all numeric inputs in contracts
- Invariant tests: protocol-level properties that must always hold

## Test Patterns
- Arrange-Act-Assert structure
- Descriptive test names: "should [expected behavior] when [condition]"
- One assertion per test (prefer)
- Test edge cases: zero values, max values, empty arrays, unauthorized access
- Mock external services, not internal modules

## Coverage Targets
- Contracts: 100% line coverage, 95%+ branch
- SDK: 90%+ line coverage
- API: 90%+ line coverage
- Dashboard: 80%+ line coverage on hooks and utils
```

---

## Part 3: Technology Decisions (Every Choice Is Intentional)

### Runtime: Bun (not Node.js)

**Why:** Bun is the only runtime that natively supports the Chainlink CRE SDK's WASM compilation pipeline. It's also 3-4x faster than Node for TypeScript execution, has built-in test runner compatibility with Vitest, and native TypeScript support without compilation. Since we're building performance-critical financial infrastructure, the speed matters. Additionally, the CRE SDK documentation explicitly states: "The wasm compilation currently is only supported by the bun runtime."

### Smart Contracts: Foundry (not Hardhat)

**Why:** Foundry is Solidity-native. Tests are written in Solidity, which means test behavior exactly matches production behavior. Forge's fuzz testing is built-in and generates edge cases automatically. Gas snapshots track optimization over time. Foundry is also significantly faster than Hardhat for compilation and testing. For a financial protocol where gas costs directly impact user costs, Foundry's gas optimization tooling is essential.

### Blockchain Library: viem (not ethers.js)

**Why:** viem is type-safe by default — every contract interaction is fully typed from the ABI. It's designed for the modern EVM ecosystem with native support for EIP-1559, account abstraction, and smart contract wallets. It's also the library used by the Coinbase CDP SDK and wagmi (the standard React hooks for Ethereum). Since we're wrapping Coinbase Agentic Wallets, using the same library they use eliminates impedance mismatches.

### API Framework: Hono (not Express, not Fastify)

**Why:** Hono is built for edge computing and runs natively on Bun. It's 5-10x faster than Express, has built-in middleware for CORS, rate limiting, and Zod validation. It generates OpenAPI specs from route definitions. Most importantly, it's tiny (14KB) — for a financial API that needs to be fast and secure, a minimal attack surface is a feature. Hono also runs on Cloudflare Workers, Vercel Edge Functions, and Bun — giving us deployment flexibility.

### Frontend: Next.js 15 + React 19 + Tailwind v4 + shadcn/ui

**Why Next.js 15:** Server components by default reduce client-side JavaScript. App Router provides nested layouts (dashboard shell stays mounted while pages change). Built-in API routes for dashboard backend needs. Vercel deployment is zero-config. React 19's `use` hook simplifies data fetching in server components.

**Why Tailwind v4:** The new engine is CSS-native (no PostCSS plugin), faster, and uses CSS variables for theming — which means we can theme the entire dashboard with a single CSS variable change for white-labeling later. No utility class changes needed.

**Why shadcn/ui:** Not a component library — it's copy-paste components that you own. No dependency lock-in. Components are built on Radix UI primitives (accessible by default) and styled with Tailwind. We can customize every component to match Qova's brand without fighting a library's opinions.

### Validation: Zod (everywhere)

**Why:** Zod schemas are the single source of truth for data shapes across the entire stack. The same schema validates API inputs, generates OpenAPI docs, provides TypeScript types, and validates SDK configuration. When a schema changes, every consumer is automatically updated. For a financial protocol where data integrity is critical, having one validation layer that the entire codebase shares eliminates entire classes of bugs.

### Monorepo Orchestration: Turborepo

**Why:** Turborepo understands the dependency graph between packages and only rebuilds what changed. It caches build outputs. It runs tasks in parallel where possible. For a monorepo with 6+ packages where a change to `sdk` needs to trigger rebuilds of `api`, `dashboard`, and `integrations`, Turborepo handles this correctly without manual configuration.

### CRE SDK: TypeScript (not Go)

**Why:** The CRE SDK supports both Go and TypeScript. We chose TypeScript for consistency with the rest of the stack — the SDK, API, and dashboard are all TypeScript. This means a single set of types, a single testing framework, and developers don't need to context-switch languages. The TypeScript CRE SDK uses Bun for WASM compilation and has full feature parity with Go.

---

## Part 4: Safety & Security Framework

### Smart Contract Security

1. **OpenZeppelin v5 as base** — battle-tested implementations for ERC-721, AccessControl, ReentrancyGuard, Pausable
2. **Checks-effects-interactions pattern** — all state changes happen before external calls
3. **Reentrancy guards** — on every function that transfers value or modifies critical state
4. **Custom errors** — gas-efficient, typed error handling (not require strings)
5. **Pausable** — emergency circuit breaker on all contracts
6. **Timelock** — admin functions go through timelock delay
7. **Multi-sig** — contract ownership by multi-sig (Safe), not EOA
8. **Upgradability** — UUPS proxy pattern for Identity and Reputation registries (allows bug fixes without losing data)
9. **Audit trail** — every state change emits an indexed event

### API Security

1. **Input validation** — Zod on every endpoint, reject malformed requests
2. **Rate limiting** — per-IP and per-API-key limits using Hono middleware
3. **Authentication** — API keys for machine-to-machine, JWT for dashboard sessions
4. **Authorization** — role-based access (agent owner can only query own agents)
5. **CORS** — strict origin allowlist
6. **Helmet headers** — security headers on all responses
7. **Request signing** — HMAC signatures for webhook callbacks
8. **Structured logging** — every request logged with ID, no secrets in logs
9. **Error sanitization** — internal errors never leaked to clients

### SDK Security

1. **No private key storage** — keys never touch Qova's servers or SDK memory beyond initialization
2. **Budget enforcement** — hard limits checked locally before transaction submission
3. **Transaction simulation** — dry-run transactions before broadcast (viem's simulateContract)
4. **Allowlist/denylist** — configurable lists of approved/blocked counterparty addresses
5. **Spending alerts** — configurable thresholds that emit warnings

### Dashboard Security

1. **No inline scripts** — strict CSP headers
2. **XSS prevention** — React's default escaping + no dangerouslySetInnerHTML
3. **CSRF protection** — SameSite cookies + CSRF tokens on mutations
4. **Auth flow** — OAuth 2.0 / wallet-based auth (SIWE — Sign In With Ethereum)
5. **Session management** — short-lived tokens, secure httpOnly cookies

### User Data Safety

1. **Minimal data collection** — only what's needed for scoring
2. **On-chain data is public** — clearly communicated to users
3. **Off-chain data encrypted** — AES-256 at rest, TLS 1.3 in transit
4. **Data retention policy** — configurable, with deletion API
5. **GDPR-ready** — export and delete endpoints from day one
6. **No training on user data** — Qova never uses transaction data to train models

---

## Part 5: Build Execution Plan

### Phase 0: Foundation (Days 1-2)

**Goal:** Monorepo scaffolding, CLAUDE.md hierarchy, all subagent definitions, CI/CD skeleton.

Tasks:
- Initialize monorepo with Bun workspaces + Turborepo
- Create root CLAUDE.md and all package-level CLAUDE.md files
- Create all 6 subagent definitions in .claude/agents/
- Create all custom slash commands in .claude/commands/
- Set up Biome for linting/formatting
- Set up GitHub repo with branch protection
- Initialize Foundry project in contracts/
- Initialize Next.js 15 project in dashboard/
- Initialize Hono project in api/
- Initialize CRE project in cre/
- Create qova-progress.txt with full feature list
- First git commit: "chore: initialize Qova monorepo"

### Phase 1: Smart Contracts (Days 2-5)

**Goal:** Production-ready contracts deployed to Base Sepolia testnet.

Using: **solidity-architect** subagent

Tasks:
- QovaIdentityRegistry.sol — ERC-8004 compatible, ERC-721 NFT identity
- QovaReputationRegistry.sol — Financial feedback storage, score snapshots
- QovaFacilitator.sol — x402 payment processing hooks, data capture
- Full Foundry test suite (unit + fuzz + invariant)
- Deployment scripts for Base Sepolia
- Gas optimization pass
- **Security auditor** review before deployment

### Phase 2: Core SDK (Days 3-7)

**Goal:** @qova/core SDK with wallet, identity, reputation, and facilitator modules.

Using: **typescript-engineer** subagent

Tasks:
- types.ts — Complete type definitions (Agent, Reputation, Budget, Score, Transaction)
- wallet.ts — Coinbase CDP wallet wrapper with budget enforcement
- identity.ts — ERC-8004 registration and verification via viem
- reputation.ts — Score queries, feedback submission
- facilitator.ts — x402 payment flow with off-chain context capture
- budget.ts — Spending rules, limits, alerts
- index.ts — Main Qova class with developer-friendly API
- Full Vitest test suite
- Package build with tsup (ESM + CJS + types)

### Phase 3: CRE Workflows (Days 5-8) — HACKATHON PRIORITY

**Goal:** Two working CRE workflows that pass simulation, ready for hackathon submission.

Using: **cre-workflow-engineer** subagent

Tasks:
- Reputation Scoring Workflow:
  - Cron trigger (periodic scoring) + HTTP trigger (on-demand)
  - HTTPClient to fetch off-chain transaction context
  - EVMClient to read on-chain transaction history from Base
  - Score computation logic
  - EVMClient to write updated reputation snapshot on-chain
- Pre-Transaction Trust Check Workflow:
  - HTTP trigger (agent requests trust check)
  - EVMClient to resolve ERC-8004 identity
  - EVMClient to read reputation snapshot
  - Risk rule application
  - HTTP response with approve/deny/warn signal
- CRE test suite using built-in test framework
- Simulation via `cre workflow simulate` with broadcast
- Demo script for hackathon video

### Phase 4: API Service (Days 6-9)

**Goal:** REST API for reputation queries, identity verification, and analytics.

Using: **typescript-engineer** subagent

Tasks:
- Hono server with middleware stack (CORS, rate limiting, auth, logging)
- Routes: /agents, /agents/:id/reputation, /agents/:id/transactions, /scores
- Zod schemas for all inputs/outputs
- OpenAPI spec auto-generation
- Database: Drizzle ORM + PostgreSQL (Neon serverless)
- Webhook system for score change notifications
- Vitest integration tests

### Phase 5: Dashboard (Days 8-12)

**Goal:** Web dashboard at app.qova.cc with agent monitoring and reputation visualization.

Using: **ui-designer** subagent

Tasks:
- Next.js 15 project with App Router
- Auth: wallet-based SIWE (Sign In With Ethereum)
- Pages: Overview, Agent Detail, Transactions, Reputation, Settings
- Components: ScoreGauge, ReputationChart, TransactionTable, AlertBanner
- Recharts visualizations for score trends and factor breakdowns
- Responsive design, dark mode first
- Deployed to Vercel

### Phase 6: Framework Integrations (Days 10-14)

**Goal:** @qova/langgraph and @qova/crewai packages.

Using: **typescript-engineer** subagent

Tasks:
- @qova/langgraph — LangGraph tool node that wraps Qova SDK
- @qova/crewai — CrewAI tool integration
- Documentation and quickstart guides for each
- Example agents using each integration

### Phase 7: Security Review & Hardening (Days 13-15)

**Goal:** Full security audit across all packages.

Using: **security-auditor** subagent

Tasks:
- Smart contract audit (reentrancy, access control, overflow)
- API security review (injection, auth bypass, rate limiting)
- SDK security review (key handling, budget enforcement)
- Dashboard security review (XSS, CSRF, CSP)
- Dependency audit (bun audit)
- Fix all CRITICAL and HIGH findings
- Document remaining MEDIUM/LOW findings with mitigation plans

---

## Part 6: Chainlink Hackathon Submission (DEADLINE: March 8)

### Target Track: CRE & AI ($17,000)

### What to Submit:
1. **Public GitHub repo** with clean README linking all Chainlink files
2. **3-5 minute video** demonstrating:
   - Agent A created with Qova SDK (wallet + identity)
   - Agent A checks Agent B's reputation via CRE workflow
   - CRE workflow computes trust score from on-chain + off-chain data
   - Agent A makes x402 payment through Qova facilitator
   - After service delivery, Agent A submits financial feedback
   - CRE workflow triggers, recomputes Agent B's reputation on-chain
   - Dashboard shows both agents' reputation histories
3. **CRE workflow simulation** showing successful execution via CLI
4. **Deployed contracts** on Base Sepolia testnet

### What Must Be Working:
- [ ] CRE Reputation Scoring Workflow (compiles, simulates, writes on-chain)
- [ ] CRE Trust Check Workflow (compiles, simulates, returns signal)
- [ ] At least one smart contract deployed to testnet
- [ ] SDK demo showing agent creation → payment → feedback → score update
- [ ] 3-5 minute video recorded and published

### Hackathon-Specific Sprint (Now → March 8):
- **Days 1-3:** Contracts + CRE workflows (minimum viable for simulation)
- **Days 4-5:** SDK core (enough for demo flow)
- **Days 6-7:** Integration demo + video recording
- **Day 8:** Polish README, submit

---

## Part 7: Claude Code Workflow Best Practices

### Session Management

1. **Start every session with context:** Read qova-progress.txt first
2. **One task per session:** Don't try to build contracts AND API in one session
3. **Use /clear between tasks:** Fresh context prevents confusion
4. **Commit before clearing:** Always save state to git before resetting
5. **Update progress file:** After every completed task

### Subagent Usage

1. **Use subagents for exploration:** "Use the typescript-engineer subagent to investigate how viem handles contract events"
2. **Use subagents for parallel work:** "Use the test-engineer subagent to write tests for wallet.ts while I continue with identity.ts"
3. **Use security-auditor before deployment:** "Use the security-auditor subagent to review all contract changes since last audit"
4. **Keep main context clean:** Heavy research goes to subagents

### Progress Tracking

The qova-progress.txt file is the coordination mechanism between sessions:

```
# Qova Build Progress
Last updated: [date]
Current phase: [phase number]

## Completed
- [x] Monorepo scaffolding (commit: abc123)
- [x] Root CLAUDE.md (commit: def456)
...

## In Progress
- [ ] QovaIdentityRegistry.sol — 70% complete, missing access control tests

## Blocked
- [ ] CRE deployment — waiting for early access approval

## Next Up
- [ ] QovaReputationRegistry.sol
- [ ] SDK types.ts

## Architecture Decisions
- [date] Chose Hono over Express for API — see docs/decisions/001-api-framework.md
- [date] Chose UUPS over Transparent proxy — see docs/decisions/002-proxy-pattern.md
```

### Git Workflow

```bash
# Feature branches from main
git checkout -b feat/identity-registry

# Frequent small commits
git add -A && git commit -m "feat(contracts): add agent registration function"

# Squash merge to main
git checkout main && git merge --squash feat/identity-registry
```

---

## Summary

**11 products. 6 specialized Claude Code subagents. 1 monorepo. Zero manual coding.**

The entire build is orchestrated through Claude Code with:
- Hierarchical CLAUDE.md files for context-efficient navigation
- Specialized subagents for domain-specific expertise
- Custom slash commands for common operations
- Progress tracking for multi-session continuity
- Security auditor integrated into the workflow, not bolted on after

The tech stack is intentionally chosen: Bun for speed and CRE compatibility, Foundry for contract-native testing, viem for type-safe blockchain interaction, Hono for minimal-surface API, Next.js 15 for server-first dashboard, and Tailwind v4 + shadcn/ui for a design system we own completely.

Every decision traces back to one of three principles:
1. **Safety first** — financial infrastructure cannot be sloppy
2. **Developer experience** — if it's hard to integrate, no one will
3. **Data capture** — every architectural choice should maximize the transaction data flowing through the facilitator

The Chainlink hackathon is the forcing function. Build the CRE workflows + contracts + SDK demo in 8 days, submit, then continue building the full stack.