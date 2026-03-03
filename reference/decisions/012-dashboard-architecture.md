# ADR-012: Dashboard Architecture

## Status
Accepted

## Context
The Qova dashboard serves as the primary demo interface for the Chainlink Convergence hackathon. Judges will evaluate via a 3-5 minute video walkthrough. The dashboard must:

1. Present agent trust scores, breakdowns, and verification results
2. Work standalone with seed data when the API is unavailable
3. Support light/dark/system themes without FOUC
4. Follow an "Institutional Minimal" design aesthetic (borders not shadows)

## Decision

### Stack
- **Next.js 15** with App Router and Turbopack
- **Tailwind CSS v4** with CSS-based `@theme` configuration
- **next-themes** for theme switching (class strategy, dark default)
- **Recharts** for data visualization
- **Lucide React** for icons (matching shadcn/ui ecosystem)

### Architecture
- **Client-side data fetching** via custom hooks (`useAgents`, `useAgent`, etc.)
- **Seed data fallback**: All hooks try the API first, fall back to `SEED_AGENTS` on error
- **`isDemo` flag** propagated through hooks to show "Demo Data" badge in header
- **No server components for data**: All data-fetching pages are client components to support the fallback pattern
- **Server components** used only for the root layout (fonts, ThemeProvider)

### Design System
- HSL CSS variables for all colors (light + dark modes)
- Three font families: Sora (headings), Inter (body), JetBrains Mono (mono/scores)
- **Zero box-shadow rule**: All visual hierarchy via borders (1px structural, 2px emphasis)
- Score colors: green (>= 700), yellow (>= 400), red (< 400)
- Grade colors: green (AAA-BBB), yellow (BB-CCC), red (CC-D)

### Pages
1. `/` -- Overview with stat cards, score distribution chart, top agents, recent activity
2. `/agents` -- Sortable agent table with grade badges
3. `/agents/[address]` -- Agent detail with ScoreRing, breakdown, tx stats, budget
4. `/scores` -- Score lookup tool with breakdown + leaderboard
5. `/verify` -- Single-agent verification with animated result

### Component Hierarchy
- `AppLayout` > `Sidebar` + `Header` + `main`
- Score components: `ScoreRing`, `ScoreBadge`, `ScoreBreakdown`, `ScoreIndicator`
- Charts: `ScoreDistribution` (bar), `BudgetUsage` (progress bar)
- UI: `ThemeToggle` (3-mode dropdown)

## Consequences
- Dashboard works offline with realistic demo data
- Theme switching is instant with no flash
- No shadcn/ui CLI dependency (components are hand-written to spec)
- Lucide icons diverge from root CLAUDE.md's Phosphor Icons rule (acceptable for hackathon scope)
