# Qova

**Financial Trust Infrastructure for AI Agents**

Qova is a credit bureau for autonomous AI agents. It computes economic trustworthiness from on-chain transaction data and enables credit, insurance, and risk assessment for agents operating via the x402 payment protocol.

## Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Contracts   │    │   @qova/core │    │   Hono API   │
│  (Solidity)  │◄───│     (SDK)    │◄───│  (REST/Bun)  │
│  Base Sepolia│    │  TypeScript  │    │  21 endpoints│
└──────┬───────┘    └──────────────┘    └──────┬───────┘
       │                                       │
       │           ┌──────────────┐            │
       └──────────►│  Dashboard   │◄───────────┘
                   │  (Next.js)   │
                   │  + Convex DB │
                   └──────┬───────┘
                          │
                   ┌──────┴───────┐
                   │ Chainlink CRE│
                   │  (Workflows) │
                   └──────────────┘
```

| Package | Description |
|---------|-------------|
| `contracts/` | Solidity smart contracts (Foundry) |
| `sdk/` | TypeScript SDK (`@qova/core`) |
| `api/` | REST API (Hono on Bun) |
| `dashboard/` | Web dashboard (Next.js 15, Convex, Clerk) |
| `cre/` | Chainlink CRE scoring workflows |
| `integrations/` | Framework plugins (LangGraph, CrewAI, n8n) |

## Smart Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| QovaCore | [`0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a`](https://sepolia.basescan.org/address/0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a) |
| ReputationRegistry | [`0x0b2466b01E6d73A24D9C716A9072ED3923563fBB`](https://sepolia.basescan.org/address/0x0b2466b01E6d73A24D9C716A9072ED3923563fBB) |
| TransactionValidator | [`0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900`](https://sepolia.basescan.org/address/0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900) |
| BudgetEnforcer | [`0x271618781040dc358e4F6B66561b65A839b0C76E`](https://sepolia.basescan.org/address/0x271618781040dc358e4F6B66561b65A839b0C76E) |

Chain ID: `84532` (Base Sepolia)

## Tech Stack

- **Runtime**: Bun
- **Contracts**: Solidity 0.8.28+, Foundry, OpenZeppelin v5
- **SDK**: TypeScript 5.7+, viem, Zod
- **API**: Hono 4.7, Bun runtime
- **Dashboard**: Next.js 15, React 19, Tailwind v4, shadcn/ui, Convex, Clerk
- **CRE**: Chainlink CRE SDK, WASM workflows
- **Blockchain**: viem + wagmi (Base L2)
- **Monorepo**: Turborepo + Bun workspaces

## Environment Variables

### Dashboard (`dashboard/.env.local`)

```env
CONVEX_DEPLOYMENT=             # Convex deployment ID
NEXT_PUBLIC_CONVEX_URL=        # Convex HTTP endpoint
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  # Clerk publishable key
CLERK_SECRET_KEY=              # Clerk secret key
NEXT_PUBLIC_API_URL=           # Qova API base URL (e.g. https://qova-api.vercel.app/api)
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.basescan.org
```

### API (`api/.env`)

```env
RPC_URL=                       # Base Sepolia RPC endpoint
DEPLOYER_PRIVATE_KEY=          # Contract deployer wallet private key
PORT=3001                      # API server port (default: 3001)
```

### Convex (set via `npx convex env set`)

```env
QOVA_API_URL=                  # Qova API base URL for Convex actions
```

## Getting Started

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Start development servers (API + Dashboard)
bun run dev

# Run tests
bun run test

# Lint and format
bun run check
```

### Individual packages

```bash
# Smart contracts
cd contracts && forge build && forge test -vvv

# SDK
cd sdk && bun run build && bun run test

# API (port 3001)
cd api && bun run dev

# Dashboard (port 3000)
cd dashboard && bun run dev
```

### Seed demo data (Convex)

```bash
cd dashboard
npx convex dev    # local
npx convex run mutations/seed:seedDemoData          # local
npx convex run mutations/seed:seedDemoData --prod   # production
```

## Deployment

- **Dashboard**: Vercel (auto-deploys from `main`)
- **API**: Vercel Serverless Functions (Hono adapter)
- **Contracts**: Foundry `forge script` with `--broadcast`
- **CRE Workflows**: Chainlink CRE Network

## License

MIT
