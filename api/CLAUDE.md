# api/ -- Qova API Service

## Overview
REST API built with Hono framework on Bun runtime.
NOT Express. NOT Fastify.

## Routes
- `POST /agents` -- Register agent identity
- `GET /agents/:id` -- Get agent details
- `GET /reputation/:agentId` -- Get reputation score
- `POST /reputation/:agentId/feedback` -- Submit feedback
- `GET /transactions` -- List transactions
- `POST /transactions` -- Record transaction
- `GET /scores/:agentId` -- Detailed score breakdown

## Middleware Stack
1. CORS (configurable origins)
2. Rate limiting (per IP + per API key)
3. Request logging (structured JSON)
4. Auth (Clerk JWT verification)
5. Zod validation (request body + params)
6. Error handling (consistent JSON errors)

## Conventions
- Hono for routing and middleware
- Zod schemas define both validation and OpenAPI spec
- Convex client for database operations
- Structured JSON error responses with error codes
- All endpoints rate-limited
- No console.log -- use structured logger

## Commands
```bash
bun run dev      # Start dev server
bun run build    # Compile
bun run test     # Run vitest
```
