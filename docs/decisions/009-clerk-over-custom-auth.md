# ADR-009: Clerk over Custom Auth

**Date:** 2026-02-26
**Status:** Accepted
**Author:** Qova Engineering

## Context
The dashboard needs authentication with support for wallet-based login (SIWE - Sign In With Ethereum).

## Decision
Use Clerk for authentication with SIWE integration.

## Alternatives Considered
1. **Custom JWT auth**: Full control but significant development and security burden.
2. **NextAuth/Auth.js**: Open source but SIWE support is community-maintained and less polished.
3. **Privy**: Good Web3 auth but narrower feature set for non-crypto users.

## Consequences
- **Gained**: Pre-built UI components, SIWE support, session management, webhook events, low maintenance.
- **Sacrificed**: Monthly cost at scale, less customization than custom auth, vendor dependency.
