# Qova Dashboard: Production-Grade Upgrade Plan

## Goal
Replace all demo/placeholder data with Convex real-time queries and upgrade the dashboard to use shadcn charts with the dashboard-01 layout shell.

---

## Phase 1: Layout Migration (dashboard-01 shell)

### 1.1 Rebrand AppSidebar
**File:** `src/components/app-sidebar.tsx`
- Replace "Acme Inc." with Qova logo (`LogoMark` + "Qova")
- Replace @tabler/icons-react with @phosphor-icons/react
- Set nav items to Qova routes:
  - Overview (`/`) -- ChartBar icon
  - Agents (`/agents`) -- Robot icon
  - Transactions (`/transactions`) -- ArrowsLeftRight icon
  - Scores (`/scores`) -- ChartLine icon
  - Budgets (`/budgets`) -- Wallet icon
  - Verify (`/verify`) -- ShieldCheck icon
- Remove navClouds section (not applicable)
- Update navSecondary: Settings, Search
- Remove navDocuments section
- User section: placeholder for Clerk auth

### 1.2 Adopt SidebarProvider layout
**File:** `src/app/layout.tsx`
- Wrap children with `SidebarProvider` + `SidebarInset`
- Remove the old `AppLayout` component usage from all pages
- Keep `ConvexProvider`, `ThemeProvider`, `TooltipProvider`

### 1.3 Update SiteHeader
**File:** `src/components/site-header.tsx`
- Replace @tabler icons with Phosphor
- Add breadcrumb based on current route
- Keep sidebar trigger and separator

---

## Phase 2: Data Layer (Convex, no demo data)

### 2.1 Create Convex hooks
**File:** `src/hooks/use-convex-data.ts` (new)
- `useAgentList()` -- wraps `useQuery(api.queries.agents.list)`
- `useTopAgents(limit)` -- wraps `useQuery(api.queries.agents.getTopAgents)`
- `useGradeDistribution()` -- wraps `useQuery(api.queries.agents.countByGrade)`
- `useRecentActivity(limit)` -- wraps `useQuery(api.queries.activity.getRecent)`
- `useSystemStats()` -- wraps `useQuery(api.queries.stats.getOverview)`
- `useScoreHistory(agent)` -- wraps `useQuery(api.queries.scores.getHistory)`
- `useLeaderboard(limit)` -- wraps `useQuery(api.queries.scores.getLeaderboard)`

### 2.2 Remove seed-data imports from pages
- `src/app/page.tsx` -- remove `SEED_ACTIVITY` import, use `useRecentActivity()`
- `src/hooks/use-agents.ts` -- remove seed fallback, use Convex query directly
- `src/hooks/use-agent.ts` -- remove seed fallback
- `src/hooks/use-budget.ts` -- remove seed fallback
- `src/hooks/use-score-breakdown.ts` -- remove seed fallback
- `src/hooks/use-transactions.ts` -- remove seed fallback

### 2.3 Convex seed mutation (for dev)
**File:** `convex/mutations/seed.ts` (new)
- `seedDemoData` mutation that inserts the 8 agents + activity + score snapshots into Convex
- Only used in dev, called from a dev-only button or script
- Generates 90 days of score snapshots per agent for chart data
- Generates 50+ activity entries with realistic timestamps

---

## Phase 3: Charts (shadcn Chart + Recharts)

### 3.1 Score Trend Area Chart
**File:** `src/components/charts/score-trend-chart.tsx` (new)
- Replaces `chart-area-interactive.tsx` demo chart
- Uses shadcn `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`
- Recharts `AreaChart` showing average score over time
- Time range toggle: 7d / 30d / 90d (reuses the toggle pattern from dashboard-01)
- Data source: `useScoreHistory()` or aggregated from all agents' snapshots
- Gradient fill using `var(--color-score)` (mapped to score-green)
- JetBrains Mono for numeric labels

### 3.2 Grade Distribution Bar Chart
**File:** `src/components/charts/score-distribution.tsx` (update existing)
- Wrap in shadcn `ChartContainer` with `ChartConfig`
- Use `ChartTooltip` + `ChartTooltipContent` instead of custom tooltip
- Data source: `useGradeDistribution()` Convex query
- Colors: green (AAA-A), yellow (BBB-B), red (CCC-D)

### 3.3 Activity Volume Chart
**File:** `src/components/charts/activity-chart.tsx` (update existing stub)
- Recharts `BarChart` showing daily transaction count over time
- Data source: `useRecentActivity()` grouped by day
- Uses shadcn chart components

### 3.4 Budget Usage Chart
**File:** `src/components/charts/budget-usage.tsx` (update existing)
- Keep the progress bar style but wrap in shadcn Card

---

## Phase 4: Section Cards (KPI metrics)

### 4.1 Update SectionCards
**File:** `src/components/section-cards.tsx` (update)
- Replace demo data with Convex queries
- 4 cards:
  1. **Total Agents** -- from `useAgentList().length` or `useSystemStats().totalAgents`
  2. **Average Score** -- computed or from `useSystemStats().avgScore`
  3. **Total Volume** -- aggregated from agents' `totalVolume`
  4. **High Grade Agents** -- count of agents with score >= 700
- Replace @tabler icons with Phosphor
- Trends: computed by comparing current vs previous period (or shown as static until we have historical systemStats)

---

## Phase 5: Data Table (agents list)

### 5.1 Adapt DataTable for agents
**File:** `src/components/data-table.tsx` (update)
- Replace the demo schema (`header`, `type`, `status`, `target`, `limit`, `reviewer`, `description`) with Qova agent fields:
  - Checkbox (selection)
  - Address (mono font, truncated, link to `/agents/[address]`)
  - Score (mono font, colored by grade)
  - Grade (ScoreBadge component)
  - Tx Count (mono font)
  - Volume (mono font, ETH)
  - Success Rate (percentage)
  - Last Updated (relative time)
  - Status (registered/unregistered badge)
  - Actions (view, verify)
- Data source: `useAgentList()` Convex query
- Keep drag-reorder, column visibility, pagination
- Remove tabs that don't apply (Past Performance, Key Personnel, Focus Documents)
- Replace @tabler icons with Phosphor

---

## Phase 6: Page Assembly

### 6.1 Overview page (`/`)
- Use `SidebarInset` layout (no more `AppLayout`)
- SectionCards at top (4 KPI cards from Convex)
- Score Trend Area Chart (90-day default)
- Two-column grid: Grade Distribution + Top Agents leaderboard
- Recent Activity table at bottom

### 6.2 Dashboard page (`/dashboard`)
- Either redirect to `/` or remove entirely (avoid duplicate routes)

### 6.3 Other pages
- `/agents` -- use DataTable with agent columns
- `/agents/[address]` -- keep existing detail view, switch hooks to Convex
- `/transactions` -- keep existing, switch to Convex activity queries
- `/scores`, `/budgets`, `/verify` -- flesh out stubs using Convex data

---

## Phase 7: Cleanup

- Remove `src/lib/seed-data.ts` (move seed logic to Convex mutation)
- Remove `src/app/dashboard/data.json` (demo data file)
- Remove old `src/components/layout/app-layout.tsx` (replaced by SidebarProvider)
- Remove old `src/components/layout/header.tsx` (replaced by SiteHeader)
- Remove old `src/components/layout/sidebar.tsx` (replaced by AppSidebar)
- Remove old `src/components/layout/nav-links.tsx`
- Clean up unused @tabler/icons-react imports (replace all with Phosphor)
- Run `bun run check` to lint

---

## Files Changed Summary

| Action | File | Description |
|--------|------|-------------|
| Update | `src/app/layout.tsx` | SidebarProvider wrapper |
| Update | `src/app/page.tsx` | Overview with Convex data |
| Delete | `src/app/dashboard/page.tsx` | Remove or redirect |
| Delete | `src/app/dashboard/data.json` | Remove demo JSON |
| Update | `src/components/app-sidebar.tsx` | Qova branding + Phosphor icons |
| Update | `src/components/site-header.tsx` | Phosphor icons |
| Update | `src/components/section-cards.tsx` | Qova KPIs from Convex |
| Update | `src/components/chart-area-interactive.tsx` | Score trend chart |
| Update | `src/components/data-table.tsx` | Agent table schema |
| New | `src/hooks/use-convex-data.ts` | Convex query hooks |
| New | `src/components/charts/score-trend-chart.tsx` | Score trend area chart |
| Update | `src/components/charts/score-distribution.tsx` | shadcn Chart wrapper |
| Update | `src/components/charts/activity-chart.tsx` | Daily activity bar chart |
| New | `convex/mutations/seed.ts` | Dev seed data mutation |
| Delete | `src/lib/seed-data.ts` | Remove client-side seed data |
| Delete | `src/components/layout/*` | Remove old layout components |

---

## Non-Goals (not in this PR)
- Clerk auth integration (separate task)
- Real API backend connection (depends on qova-api deployment)
- Mobile responsive polish (follow-up)
- Dark/light mode toggle in sidebar (already works via ThemeProvider)
