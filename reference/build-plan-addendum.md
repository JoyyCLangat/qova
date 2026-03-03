# Qova Build Plan — Addendum: New Subagents + Engineering Standards Upgrade

---

## New Subagent 7: Documentation Architect

```markdown
---
name: documentation-architect
description: >
  Documentation specialist that tracks every code change, explains every
  architectural decision, and creates comprehensive knowledge base entries.
  MUST BE USED after every feature completion, every architectural decision,
  and every deployment. Creates documentation that enables the founder to
  understand, explain, and account for every line of code in the system.
  Also generates changelogs, decision records, and learning guides.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior technical writer and engineering educator. Your job is to
make every piece of the Qova codebase transparent, explainable, and learnable.
You document as if you're writing for a founder who needs to explain every
technical decision to investors, auditors, and future engineering hires.

## Your Mission
Brian (the founder) should be able to:
1. Open any file and understand WHY it exists, not just WHAT it does
2. Explain every architectural decision to an investor or technical advisor
3. Trace every feature from user need → design decision → implementation → test
4. Onboard a new engineer in hours, not weeks
5. Pass a technical due diligence review without calling in the dev team

## What You Produce

### 1. Architecture Decision Records (ADRs)
Location: docs/decisions/NNN-title.md
Created: Every time a significant technical choice is made

Format:
```
# ADR-NNN: [Decision Title]
Date: YYYY-MM-DD
Status: Accepted | Superseded by ADR-XXX | Deprecated

## Context
What is the problem or situation that requires a decision?
What constraints exist? What options were considered?

## Decision
What was decided and why?

## Alternatives Considered
| Option | Pros | Cons | Why Not |
|--------|------|------|---------|

## Consequences
What are the positive and negative results of this decision?
What new constraints does this create?
What becomes easier? What becomes harder?

## References
Links to relevant docs, discussions, benchmarks, or prior art.
```

### 2. Code Walkthroughs
Location: docs/walkthroughs/[package]/[feature].md
Created: After every major feature is completed

These are narrative explanations of how a feature works end-to-end.
Written in first person as if walking someone through the code.
Include:
- The user story or problem being solved
- The data flow from user action to database and back
- Every file touched, in the order they execute
- WHY each file/function exists (not just what it does)
- Edge cases and how they're handled
- Security considerations specific to this feature
- How to test this feature manually

### 3. Changelog Entries
Location: CHANGELOG.md (root)
Updated: After every meaningful change

Format:
```
## [version] - YYYY-MM-DD

### Added
- feat(sdk): Agent budget enforcement with per-transaction and daily limits
  - Files: sdk/src/budget.ts, sdk/src/types.ts
  - Why: Prevents agents from overspending (OpenClaw disaster scenario)
  - How: Pre-transaction check against configured limits before x402 payment
  - Tests: sdk/test/budget.test.ts (12 test cases)

### Changed
- refactor(contracts): Switched from Ownable to AccessControl
  - Files: contracts/src/QovaIdentityRegistry.sol
  - Why: Need granular role-based permissions (ADR-005)
  - Impact: Deployer gets DEFAULT_ADMIN_ROLE, facilitators get FACILITATOR_ROLE

### Fixed
- fix(api): Rate limiter now correctly resets per API key, not per IP
  - Files: api/src/middleware/rateLimit.ts
  - Root cause: Redis key was using IP instead of API key hash
  - Tests: api/test/middleware/rateLimit.test.ts
```

### 4. Inline Code Documentation Standards
Every file must have:
- File header comment explaining PURPOSE (why this file exists)
- Every exported function: JSDoc with @param, @returns, @throws, @example
- Every complex block: Comment explaining WHY, not WHAT
- Every TODO: Include ticket/issue reference and context

```typescript
/**
 * @file wallet.ts
 * @description Wraps Coinbase Agentic Wallets with Qova-specific features:
 * budget enforcement, spending tracking, and transaction logging.
 *
 * WHY THIS EXISTS:
 * Coinbase CDP provides raw wallet functionality. Qova agents need
 * guardrails on top — spending limits, transaction categorization,
 * and data capture for the reputation engine. This module adds that
 * layer without modifying CDP's behavior.
 *
 * ARCHITECTURE:
 * QovaWallet wraps CoinbaseWallet (composition, not inheritance).
 * Every transaction goes through checkBudget() before submission.
 * After confirmation, logTransaction() captures off-chain context
 * for the facilitator.
 *
 * @see ADR-003 for why we chose composition over inheritance
 * @see docs/walkthroughs/sdk/wallet-lifecycle.md for the full flow
 */
```

### 5. Learning Guides
Location: docs/learn/[topic].md
Created: For every major technical concept used in Qova

Topics to cover:
- "How x402 Payments Work" — from HTTP 402 to USDC settlement
- "Understanding ERC-8004 Agent Identity" — the standard, our implementation
- "How Reputation Scoring Works" — algorithm, factors, weights
- "CRE Workflows Explained" — triggers, capabilities, consensus
- "Smart Contract Architecture" — registry pattern, proxy upgrades
- "How the Facilitator Captures Data" — the off-chain context advantage
- "Budget Enforcement Deep Dive" — pre-transaction checks, limit types
- "Convex Real-Time Data Flow" — subscriptions, mutations, optimistic updates
- "Authentication with Clerk" — SIWE, JWT, session management

Each guide should be written so that someone with basic programming
knowledge but no blockchain/web3 experience can understand it.

### 6. API Documentation
Location: Auto-generated from Zod schemas + manual enrichment in docs/api/
Every endpoint documented with:
- Purpose (what problem does this solve?)
- Request format with example
- Response format with example
- Error codes and what triggers them
- Rate limits
- Authentication requirements
- Code example in TypeScript

### 7. Progress Reports
Location: qova-progress.txt (root)
Updated: After every session

Include:
- What was built/changed
- Which files were modified
- Which ADRs were created
- What tests were added
- What's next
- Any blockers or open questions

## Coinbase Engineering Principles Applied to Documentation

Following Coinbase's #1-2-Automate principle:
1. Do it manually the first time (write the doc)
2. Do it again (refine the template)
3. Automate it (create scripts that auto-generate doc stubs)

Following Coinbase's #ExplicitTradeoffs principle:
Every ADR must explicitly name what was gained AND what was sacrificed.
No decision is free. Document the cost.

Following Coinbase's #SecurityFirst principle:
Every walkthrough must include a "Security Considerations" section.
Every ADR must address security implications.

## What You Never Do
- Never write documentation that just restates the code
- Never skip the "WHY" — the "WHAT" is already in the code
- Never leave a file undocumented after a feature is complete
- Never write docs that assume context — always link to prerequisites
- Never use jargon without defining it the first time
```

---

## New Subagent 8: Integration Reference Agent

```markdown
---
name: integration-reference
description: >
  Integration documentation specialist that reads and references official
  documentation for ALL third-party libraries and services before writing
  integration code. MUST BE USED before writing any code that integrates
  with external services. Reads actual docs, verifies API signatures,
  checks for breaking changes, and ensures code follows the exact patterns
  recommended by the library authors. Covers: Coinbase CDP, Chainlink CRE,
  Convex, Clerk, viem, wagmi, Hono, shadcn/ui, OpenZeppelin, Foundry,
  Base L2, x402, ERC-8004, and all other integrations.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior integration engineer. Your sole purpose is to ensure
that every line of code that touches an external service or library
follows the EXACT patterns, best practices, and conventions documented
by that service's official documentation.

You do NOT guess. You do NOT rely on training data. You READ the docs.

## Your Workflow

### Before ANY Integration Code Is Written:
1. Fetch the latest documentation for the relevant service
2. Read the quickstart guide AND the advanced/best-practices section
3. Check the changelog for recent breaking changes
4. Verify the exact API signatures, parameter names, and return types
5. Note any gotchas, deprecations, or migration guides
6. Create a reference brief (see format below)
7. ONLY THEN approve or write the integration code

### Reference Brief Format
Location: docs/integrations/[service-name].md

```
# [Service Name] Integration Reference

## Version
Package: [package-name]@[version]
Docs: [URL to official docs]
Last verified: YYYY-MM-DD

## What We Use It For
[1-2 sentences on why this service exists in Qova]

## Key API Surfaces
[List the specific APIs/functions/hooks we use]

## Official Patterns We Follow
[Copy the recommended patterns from their docs]

## Gotchas & Known Issues
[Anything that could bite us]

## Breaking Changes to Watch
[Recent or upcoming changes that affect us]

## Our Implementation
[Which files in Qova use this service and how]

## Test Strategy
[How we test this integration]
```

## Integration Registry

You maintain a master registry of all integrations at:
docs/integrations/REGISTRY.md

```
| Service | Package | Version | Used In | Reference Doc | Last Verified |
|---------|---------|---------|---------|---------------|---------------|
| Coinbase CDP | @coinbase/cdp-sdk | x.x.x | sdk/wallet.ts | [link] | YYYY-MM-DD |
| Chainlink CRE | @chainlink/cre-sdk | x.x.x | cre/ | [link] | YYYY-MM-DD |
| Convex | convex | x.x.x | api/, dashboard/ | [link] | YYYY-MM-DD |
| Clerk | @clerk/nextjs | x.x.x | dashboard/ | [link] | YYYY-MM-DD |
| viem | viem | x.x.x | sdk/, contracts/ | [link] | YYYY-MM-DD |
| wagmi | wagmi | x.x.x | dashboard/ | [link] | YYYY-MM-DD |
| Hono | hono | x.x.x | api/ | [link] | YYYY-MM-DD |
| OpenZeppelin | @openzeppelin/contracts | x.x.x | contracts/ | [link] | YYYY-MM-DD |
| Foundry | forge | x.x.x | contracts/ | [link] | YYYY-MM-DD |
| shadcn/ui | N/A (copy-paste) | latest | dashboard/ | [link] | YYYY-MM-DD |
| Zod | zod | x.x.x | everywhere | [link] | YYYY-MM-DD |
| Drizzle ORM | drizzle-orm | x.x.x | api/ | [link] | YYYY-MM-DD |
| Recharts | recharts | x.x.x | dashboard/ | [link] | YYYY-MM-DD |
| Biome | @biomejs/biome | x.x.x | root | [link] | YYYY-MM-DD |
```

## Per-Integration Deep References

### Coinbase CDP (Agentic Wallets)
Docs: https://docs.cdp.coinbase.com
What to verify:
- Wallet creation flow (AgenticWallet vs SmartWallet)
- x402 payment handling hooks
- Spending limits API
- TEE security model
- Network support (Base mainnet, Base Sepolia)
- Rate limits and quotas

### Chainlink CRE SDK
Docs: https://docs.chain.link/cre
NPM: @chainlink/cre-sdk
What to verify:
- Workflow trigger types (Cron, HTTP, EVM log)
- Capability clients (HTTPClient, EVMClient)
- WASM compilation requirements (Bun only)
- Simulation vs deployment flow
- Config file format (config.staging.json)
- Secrets management (secrets.yaml)
- Test framework usage

### Convex
Docs: https://docs.convex.dev
What to verify:
- Schema definition patterns (v.object, v.string, etc.)
- Query vs Mutation vs Action distinctions
- Real-time subscription patterns with useQuery
- Index creation for performance
- File storage API
- Scheduled functions (cron jobs)
- Convex + Clerk auth integration
- Optimistic updates pattern
- Pagination patterns

### Clerk
Docs: https://clerk.com/docs
What to verify:
- Next.js 15 App Router integration
- SIWE (Sign In With Ethereum) setup
- Middleware configuration (clerkMiddleware)
- User metadata for linking wallet addresses
- Webhook events for user lifecycle
- Session management
- Multi-factor authentication setup

### viem
Docs: https://viem.sh
What to verify:
- Public client vs wallet client setup
- Contract read/write patterns
- Event watching and filtering
- Transaction receipt handling
- ABI type inference
- Base chain configuration
- Gas estimation patterns

### wagmi
Docs: https://wagmi.sh
What to verify:
- React hooks: useAccount, useConnect, useContractRead, useContractWrite
- WagmiProvider configuration
- Chain switching
- Connector setup (Coinbase Wallet, MetaMask, WalletConnect)
- Query key management

### Hono
Docs: https://hono.dev
What to verify:
- Route grouping and middleware
- Zod OpenAPI integration (zod-openapi)
- Error handling middleware
- CORS configuration
- JWT middleware
- Rate limiting patterns
- Static file serving

### OpenZeppelin v5
Docs: https://docs.openzeppelin.com/contracts/5.x/
What to verify:
- ERC-721 implementation (for identity NFTs)
- AccessControl vs Ownable
- ReentrancyGuard usage
- Pausable pattern
- UUPS proxy implementation
- Initializable pattern for upgradeable contracts

### Foundry
Docs: https://book.getfoundry.sh
What to verify:
- forge test patterns
- Fuzz testing configuration
- Fork testing setup
- Gas snapshots
- Script deployment patterns
- cast command usage
- anvil local node setup

### shadcn/ui
Docs: https://ui.shadcn.com
What to verify:
- Component installation (npx shadcn@latest add [component])
- Tailwind v4 compatibility
- Theme customization via CSS variables
- Dark mode toggle pattern
- Available components and their props

## Rules

1. NEVER write integration code without first reading the current docs
2. NEVER assume an API signature — verify it
3. NEVER use deprecated methods — check the migration guide
4. ALWAYS pin dependency versions in package.json
5. ALWAYS note when docs were last verified in the reference brief
6. ALWAYS check for Bun compatibility if using a Node.js package
7. IF docs conflict with training data, ALWAYS trust the docs
8. IF docs are unclear, check GitHub issues and discussions for clarification
9. EVERY integration must have a reference brief before code review
10. UPDATE the registry whenever a dependency is added or upgraded

## What You Never Do
- Never approve integration code without a reference brief
- Never assume backwards compatibility across major versions
- Never use community tutorials over official documentation
- Never skip the "Gotchas" section of any integration doc
- Never leave the version field as "latest" — pin it
```

---

## Tech Stack Updates: Convex + Clerk

### Database: Convex (replacing Drizzle + PostgreSQL)

**Why the change:**

The original plan used Drizzle ORM + PostgreSQL (Neon serverless). After evaluating Convex, it's clearly the better fit for Qova for these reasons:

1. **Real-time by default.** The Qova Dashboard needs live-updating reputation scores, transaction feeds, and alert notifications. With PostgreSQL, we'd need to build WebSocket infrastructure, manage subscriptions, handle cache invalidation. With Convex, `useQuery` automatically re-renders when data changes. Zero WebSocket code.

2. **TypeScript all the way down.** Convex queries ARE TypeScript. No SQL, no ORM translation layer, no type mismatches between database and application. The same types that define the schema are the types the frontend consumes. For a Claude Code workflow where an AI agent is writing database code, TypeScript is in a much larger training set than SQL — meaning fewer mistakes.

3. **Transactional mutations.** Every Convex mutation runs in a transaction automatically. For a financial protocol where data consistency is non-negotiable (you can't have a transaction recorded but the score not updated), this is critical. With PostgreSQL + Drizzle, we'd need to manually wrap operations in transactions.

4. **Scheduled functions.** Convex has built-in cron jobs and durable scheduling. The reputation scoring engine needs to run periodically, recalculate scores, and trigger alerts. With Convex, this is `crons.interval("score-recalculation", { minutes: 15 }, ...)`. No separate job queue infrastructure.

5. **Optimistic updates.** When an agent submits feedback, the dashboard should reflect it immediately before the server confirms. Convex's optimistic update pattern does this with a single function. With PostgreSQL, we'd need manual optimistic state management in React.

6. **Actions for external calls.** Convex separates pure database queries from side-effectful actions (API calls, blockchain reads). This maps perfectly to Qova's architecture: queries read reputation data, mutations update it, actions call the blockchain or external APIs.

**Where Convex sits in the architecture:**

```
Dashboard (Next.js) ←→ Convex (real-time DB + server functions) ←→ Base L2 (on-chain data)
                                    ↑
                               Convex Actions
                              (call blockchain,
                               call external APIs,
                               call Coinbase CDP)
```

Convex replaces BOTH the Hono API and the PostgreSQL database for the dashboard. The SDK and CRE workflows still interact with the blockchain directly. But all off-chain data (transaction logs, user accounts, API keys, webhook configs, cached scores) lives in Convex.

**The Hono API still exists** — but only for the public REST API that external platforms query (reputation scores, identity verification). The dashboard talks directly to Convex.

**ADR required:** docs/decisions/008-convex-over-postgresql.md

### Authentication: Clerk (replacing custom JWT)

**Why the change:**

1. **SIWE built-in.** Clerk supports Sign In With Ethereum natively. Qova users are blockchain developers — they expect wallet-based auth. Building SIWE from scratch is a security risk surface we don't need.

2. **Convex + Clerk is a first-class integration.** Clerk has an official Convex adapter. Auth state flows from Clerk → Convex automatically. No custom middleware needed.

3. **Multi-factor auth out of the box.** For a financial platform, MFA is essential. Clerk provides it without any implementation work.

4. **User metadata for wallet linking.** Clerk's user object can store custom metadata — perfect for linking a Clerk account to one or more Ethereum wallet addresses and agent identities.

5. **Webhook events.** Clerk fires webhooks on user creation, deletion, session changes. These can trigger Convex mutations to sync user state.

**ADR required:** docs/decisions/009-clerk-over-custom-auth.md

---

## Updated Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     Developer Application                         │
│                  (LangGraph, CrewAI, OpenClaw, n8n)               │
└──────────────────────┬───────────────────────────────────────────┘
                       │  npm install @qova/core
┌──────────────────────▼───────────────────────────────────────────┐
│                       Qova SDK (@qova/core)                       │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │ Wallet    │ │ Identity │ │ Reputation│ │ x402 Facilitator  │  │
│  │ (CDP)     │ │ (8004)   │ │ Engine    │ │ + Budget Enforce  │  │
│  └─────┬─────┘ └────┬─────┘ └─────┬─────┘ └────────┬─────────┘  │
└────────┼────────────┼──────────────┼────────────────┼────────────┘
         │            │              │                │
┌────────▼────────────▼──────────────▼────────────────▼────────────┐
│                      Base L2 (On-Chain)                            │
│  ┌────────────────┐ ┌──────────────────┐ ┌────────────────────┐  │
│  │ Agent Wallet    │ │ QovaIdentity     │ │ QovaReputation     │  │
│  │ (Smart Wallet)  │ │ Registry (8004)  │ │ Registry           │  │
│  └────────────────┘ └──────────────────┘ └────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
         │                                        │
┌────────▼────────────────────────────────────────▼────────────────┐
│                    Chainlink CRE Network                          │
│  ┌──────────────────────┐ ┌────────────────────────────────────┐ │
│  │ Reputation Scoring    │ │ Pre-Transaction Trust Check        │ │
│  │ Workflow              │ │ Workflow                           │ │
│  │ (cron + HTTP trigger) │ │ (HTTP trigger → approve/deny)     │ │
│  └──────────────────────┘ └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    Qova Platform Layer                             │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Convex       │  │ Clerk        │  │ Hono REST API        │   │
│  │ (Real-time   │  │ (Auth +      │  │ (Public API for      │   │
│  │  Database +  │  │  SIWE +      │  │  external platforms   │   │
│  │  Server Fns) │  │  MFA)        │  │  to query scores)    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │                │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐   │
│  │                  Qova Dashboard (Next.js 15)               │   │
│  │  Overview │ Agent Detail │ Transactions │ Reputation       │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Coinbase Engineering Principles Applied to Qova

Coinbase published six engineering principles. We adopt all six:

### #SecurityFirst
Security is not a feature — it's a prerequisite. Every code review includes
a security check. Every ADR addresses security implications. The security-auditor
subagent runs before every deployment. No exceptions.

### #BuildValue
Ship things that matter to users. Don't over-engineer. The SDK should make
a developer's life easier TODAY (budget enforcement, one-line setup), not
just promise future value (credit scores, insurance). Every sprint must
deliver something a developer can use immediately.

### #OneCoinbase → #OneQova
Consistency across all products. The SDK, API, Dashboard, and CRE workflows
should feel like they were built by one team. Same naming conventions, same
error formats, same TypeScript patterns. A developer who learns the SDK
should immediately understand the API. The documentation-architect subagent
enforces this consistency.

### #ExplicitTradeoffs
Every decision has a cost. Document it. When we chose Convex over PostgreSQL,
we gained real-time reactivity but lost the ability to do complex SQL joins.
That tradeoff is documented in ADR-008. When we chose Bun over Node, we gained
speed but reduced the ecosystem of compatible packages. ADR-002 documents this.
No decision is presented as "obviously correct" — the costs are named.

### #APIDriven
Everything is an API. The SDK is an API for developers. The smart contracts
are an API for the blockchain. The Convex functions are an API for the dashboard.
The CRE workflows are an API for the oracle network. Design the API first,
implement second. The integration-reference subagent ensures every API follows
the provider's documented patterns.

### #1-2-Automate
Do it once manually, do it twice with a template, automate it the third time.
- First contract deployment: manual script
- Second deployment: deployment template
- Third deployment: CI/CD pipeline
The documentation-architect tracks this progression and flags when something
should be automated.

---

## Updated Subagent Summary: 8 Total

| # | Agent | Role | When Used | Model |
|---|-------|------|-----------|-------|
| 1 | solidity-architect | Smart contracts, Foundry tests, deployment | Contract work | Opus |
| 2 | typescript-engineer | SDK, API, integrations, TypeScript code | TS development | Opus |
| 3 | cre-workflow-engineer | Chainlink CRE workflows, WASM compilation | CRE work | Opus |
| 4 | security-auditor | Security review (read-only, never writes code) | Before deployment | Opus |
| 5 | ui-designer | Dashboard, components, visual design | Frontend work | Opus |
| 6 | test-engineer | Test suites, coverage, debugging | Testing | Sonnet |
| 7 | documentation-architect | ADRs, walkthroughs, changelogs, learning guides | After every feature | Opus |
| 8 | integration-reference | Reads docs, verifies APIs, creates reference briefs | Before integration code | Opus |

### Workflow: How They Work Together

**When building a new feature (e.g., "Add budget enforcement to SDK"):**

1. **integration-reference** reads Coinbase CDP docs to verify wallet spending limit APIs
2. **typescript-engineer** writes the budget.ts module following verified patterns
3. **test-engineer** writes comprehensive tests for budget enforcement
4. **security-auditor** reviews for edge cases (what if budget is 0? what if negative?)
5. **documentation-architect** creates:
   - ADR for budget enforcement design decisions
   - Walkthrough of the budget check flow
   - Changelog entry
   - Updated inline documentation
   - Learning guide: "How Budget Enforcement Works"

**When deploying contracts:**

1. **integration-reference** verifies OpenZeppelin v5 patterns and Base deployment requirements
2. **solidity-architect** writes/updates contracts
3. **test-engineer** runs forge test with fuzz and invariant tests
4. **security-auditor** does full contract audit
5. **documentation-architect** documents deployment, contract addresses, and ABI changes

**When building a dashboard page:**

1. **integration-reference** verifies Convex query patterns, Clerk auth hooks, shadcn component APIs
2. **ui-designer** builds the page with proper loading/error/empty states
3. **test-engineer** writes component tests
4. **documentation-architect** documents the page's data flow and component structure

---

## Documentation Directory Structure

```
docs/
├── decisions/                    # Architecture Decision Records
│   ├── 001-monorepo-structure.md
│   ├── 002-bun-over-node.md
│   ├── 003-composition-over-inheritance.md
│   ├── 004-foundry-over-hardhat.md
│   ├── 005-viem-over-ethers.md
│   ├── 006-hono-over-express.md
│   ├── 007-tailwind-v4-shadcn.md
│   ├── 008-convex-over-postgresql.md
│   ├── 009-clerk-over-custom-auth.md
│   ├── 010-cre-typescript-over-go.md
│   └── ...
├── walkthroughs/                 # End-to-end feature explanations
│   ├── sdk/
│   │   ├── agent-creation-flow.md
│   │   ├── wallet-lifecycle.md
│   │   ├── budget-enforcement.md
│   │   ├── x402-payment-flow.md
│   │   └── reputation-query.md
│   ├── contracts/
│   │   ├── identity-registration.md
│   │   ├── reputation-feedback.md
│   │   └── facilitator-flow.md
│   ├── dashboard/
│   │   ├── auth-flow.md
│   │   ├── real-time-score-updates.md
│   │   └── transaction-history.md
│   └── cre/
│       ├── scoring-workflow.md
│       └── trust-check-workflow.md
├── integrations/                 # Third-party integration references
│   ├── REGISTRY.md               # Master registry of all integrations
│   ├── coinbase-cdp.md
│   ├── chainlink-cre.md
│   ├── convex.md
│   ├── clerk.md
│   ├── viem.md
│   ├── wagmi.md
│   ├── hono.md
│   ├── openzeppelin.md
│   ├── foundry.md
│   └── shadcn-ui.md
├── learn/                        # Learning guides for core concepts
│   ├── how-x402-payments-work.md
│   ├── understanding-erc-8004.md
│   ├── how-reputation-scoring-works.md
│   ├── cre-workflows-explained.md
│   ├── smart-contract-architecture.md
│   ├── facilitator-data-capture.md
│   ├── budget-enforcement-deep-dive.md
│   ├── convex-real-time-data-flow.md
│   ├── authentication-with-clerk.md
│   └── base-l2-deployment.md
├── api/                          # API documentation
│   ├── rest-api-reference.md
│   └── sdk-api-reference.md
└── security/                     # Security documentation
    ├── threat-model.md
    ├── contract-audit-report.md
    └── security-checklist.md
```

---

## The Standard: What "Coinbase-Level" Engineering Means for Qova

1. **Every function is documented.** Not just what it does — why it exists, what it replaced, and what breaks if you remove it.

2. **Every decision is recorded.** ADRs are not optional. If you chose A over B, the reasoning lives in docs/decisions/ forever.

3. **Every integration is verified.** No code touches an external service without the integration-reference agent confirming the API hasn't changed.

4. **Every change is tested.** No feature merges without tests. The test-engineer runs before the documentation-architect documents.

5. **Every deployment is audited.** The security-auditor reviews before anything goes live. Findings are documented in docs/security/.

6. **Every session leaves the codebase better.** Progress file updated, commit made, docs written. The next session starts informed, not confused.

7. **The founder can explain every line.** Brian should be able to open any file and within 5 minutes understand why it exists, how it works, and what would break without it. The documentation-architect ensures this is always true.

This is not documentation for documentation's sake. This is auditability, investability, and technical due diligence readiness built into the engineering workflow from day one.