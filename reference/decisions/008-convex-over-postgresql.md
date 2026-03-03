# ADR-008: Convex over PostgreSQL

**Date:** 2026-02-26
**Status:** Accepted
**Author:** Qova Engineering

## Context
The dashboard needs a real-time database for agent scores, transaction logs, and live updates.

## Decision
Use Convex as the primary database for the dashboard and API.

## Alternatives Considered
1. **PostgreSQL + Drizzle ORM**: Battle-tested, SQL flexibility, but requires separate real-time layer (WebSockets, SSE).
2. **Supabase**: PostgreSQL with real-time, but more operational overhead than Convex.
3. **Firebase/Firestore**: Real-time capable but vendor lock-in concerns with Google Cloud.

## Consequences
- **Gained**: Built-in real-time subscriptions, automatic caching, type-safe queries, zero-config scaling, serverless.
- **Sacrificed**: No raw SQL, Convex-specific query language, vendor dependency.
