# ADR-002: Bun over Node.js

**Date:** 2026-02-26
**Status:** Accepted
**Author:** Qova Engineering

## Context
We needed a JavaScript runtime for development, testing, and production API hosting.

## Decision
Use Bun as the primary runtime and package manager.

## Alternatives Considered
1. **Node.js + npm/yarn/pnpm**: Industry standard but slower installs, no native TypeScript, separate test runner needed.
2. **Deno**: Good security model but ecosystem compatibility concerns.

## Consequences
- **Gained**: 3-5x faster installs, native TypeScript execution, built-in test runner, faster HTTP serving.
- **Sacrificed**: Smaller ecosystem, some Node.js APIs not yet supported, team needs Bun familiarity.
