# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.0.1] - 2026-02-26

### Added
- Monorepo scaffold with Bun workspaces and Turborepo
- 6 packages: contracts (Foundry), sdk (TypeScript), api (Hono), dashboard (Next.js 15), cre (Chainlink CRE), integrations
- Smart contract project initialized with Foundry and OpenZeppelin v5
- SDK with Result<T,E> pattern, Zod schemas for AgentIdentity, ReputationScore, TransactionRecord
- API server with Hono, CORS, health check, agent and reputation route stubs
- CRE workflow placeholders for reputation scoring and trust checks
- Integration package stubs for LangGraph, CrewAI, and n8n
- 8 development subagent definitions
- 6 custom slash commands (build, test, deploy-testnet, security-review, progress)
- Biome linting and formatting configuration
- shadcn MCP server configuration
- 5 Architecture Decision Records (ADRs)
- Full documentation structure with walkthroughs, integrations, and learning guides
- Qova design system: monochrome + functional signal accents
