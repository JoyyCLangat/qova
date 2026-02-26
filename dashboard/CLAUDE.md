# dashboard/ -- Qova Dashboard

## Overview
Next.js 15 App Router dashboard with React 19, Tailwind v4, shadcn/ui.
Deployed on Vercel. Real-time data via Convex. Auth via Clerk.

## Design System
- Colors: Black/White base. Yellow (#FACC15) for CTA/warnings. Red (#EF4444) for errors. Green (#22C55E) for success only.
- Fonts: Inter (UI text), JetBrains Mono (scores, numbers, code, addresses)
- Icons: Phosphor Icons (@phosphor-icons/react) -- NEVER Lucide
  - SSR: @phosphor-icons/react/ssr for server components
  - Default weight: regular. Fill for active. Duotone for decorative.
- Dark mode FIRST, light mode secondary

## Pages
- `/` -- Overview (score summary, recent activity, alerts)
- `/agents` -- Agent list with scores
- `/agents/:id` -- Agent detail (score history, transactions, feedback)
- `/transactions` -- Transaction log with filters
- `/reputation` -- Reputation analytics and charts
- `/settings` -- API keys, webhooks, preferences

## Component Patterns
- Server Components by default, "use client" only when needed
- Skeleton loading screens (never spinners)
- Error boundaries on every data-fetching component
- shadcn/ui via MCP -- always verify component APIs before use
- Charts: shadcn Chart + Recharts, JetBrains Mono for numeric labels

## Commands
```bash
bun run dev      # Start Next.js dev server
bun run build    # Production build
bun run test     # Run vitest
```

## Never
- NEVER import from lucide-react
- NEVER use color decoratively
- NEVER skip loading/error/empty states
- NEVER hardcode colors -- use CSS variables or Tailwind theme
