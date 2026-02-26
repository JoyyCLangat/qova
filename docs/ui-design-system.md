# Qova Build Plan — UI Design System & Frontend Architecture

---

## Visual Identity

### Color System: Monochrome + Signal Accents

The Qova UI is built on a strict black and white foundation with two accent colors reserved exclusively for functional meaning. No decoration. Every color communicates something.

```css
:root {
  /* Base — the canvas */
  --qova-black: #000000;
  --qova-white: #FFFFFF;
  --qova-gray-50: #FAFAFA;
  --qova-gray-100: #F4F4F5;
  --qova-gray-200: #E4E4E7;
  --qova-gray-300: #D4D4D8;
  --qova-gray-400: #A1A1AA;
  --qova-gray-500: #71717A;
  --qova-gray-600: #52525B;
  --qova-gray-700: #3F3F46;
  --qova-gray-800: #27272A;
  --qova-gray-900: #18181B;
  --qova-gray-950: #09090B;

  /* Signal Yellow — attention, active, in-progress, warnings */
  --qova-yellow: #FACC15;
  --qova-yellow-light: #FDE047;
  --qova-yellow-dark: #CA8A04;
  --qova-yellow-muted: rgba(250, 204, 21, 0.15);

  /* Signal Red — critical, error, low reputation, alerts */
  --qova-red: #EF4444;
  --qova-red-light: #FCA5A5;
  --qova-red-dark: #DC2626;
  --qova-red-muted: rgba(239, 68, 68, 0.15);

  /* Functional greens (used sparingly for positive signals only) */
  --qova-green: #22C55E;
  --qova-green-muted: rgba(34, 197, 94, 0.15);
}
```

### When Each Color Is Used

| Color | Used For | Never Used For |
|-------|----------|----------------|
| Black (#000000) | Backgrounds (dark mode), text (light mode), primary surfaces | Decorative elements |
| White (#FFFFFF) | Text (dark mode), backgrounds (light mode), primary surfaces | — |
| Gray scale | Borders, secondary text, cards, dividers, disabled states | Primary actions |
| Yellow (#FACC15) | Active icons, in-progress badges, warning alerts, score "caution" range (400-600), interactive hover states, CTA buttons | Body text, backgrounds, large surfaces |
| Red (#EF4444) | Error states, critical alerts, low reputation scores (<400), delete actions, dispute indicators | Decorative, backgrounds, body text |
| Green (#22C55E) | Success confirmations, high reputation (>800), positive score changes, "verified" badges | Primary UI elements, navigation, large surfaces |

### Typography

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

| Use Case | Font | Weight | Size |
|----------|------|--------|------|
| Page titles | Inter | 700 (Bold) | 28-32px |
| Section headers | Inter | 600 (Semibold) | 20-24px |
| Body text | Inter | 400 (Regular) | 14-16px |
| Labels, captions | Inter | 500 (Medium) | 12-13px |
| Qova Scores | JetBrains Mono | 700 (Bold) | 24-48px |
| Code, addresses, hashes | JetBrains Mono | 400 (Regular) | 13-14px |
| Metric numbers | JetBrains Mono | 600 (Semibold) | 16-20px |

### Logo Usage

The Qova logo (pixel-face icon) is always rendered in monochrome — white on black or black on white. Accent colors never touch the logo.

---

## MCP Server Configuration

### Claude Code .mcp.json

Every Claude Code session for the Qova dashboard must have these MCP servers configured:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.shadcn.io/api/mcp"]
    },
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["-y", "shadcn-ui-mcp-server"]
    }
  }
}
```

### What These MCP Servers Provide

**Official shadcn MCP (shadcn.io/api/mcp):**
- Browse all available components, blocks, and templates
- Search across registries for specific components
- Install components via natural language ("add a card component")
- Access community registry components
- Get current TypeScript props and usage patterns

**shadcn-ui-mcp-server:**
- list-components: Get all available shadcn/ui components
- get-component-docs: Get documentation for any specific component
- get-component-examples: Get usage examples
- search-components: Search by keyword

### Claude Code Commands for UI Work

Add these to `.claude/commands/`:

```markdown
# /ui-component (commands/ui-component.md)
description: Add a new shadcn/ui component to the dashboard
---
Use the shadcn MCP server to:
1. Search for the requested component
2. Check its current props and TypeScript interface
3. Install it using `npx shadcn@latest add [component]`
4. Create a Qova-themed wrapper in dashboard/src/components/ui/
5. Apply the Qova color system (black/white/yellow/red)
6. Use Phosphor icons (not Lucide) for any icons within the component
7. Ensure dark mode compatibility
8. Add the component to the component index
```

```markdown
# /ui-chart (commands/ui-chart.md)
description: Add a chart component to the dashboard
---
Use the shadcn MCP server to:
1. Install the shadcn chart component if not already installed
2. Reference the shadcn charts library for the requested chart type
3. Build the chart using Recharts components + shadcn ChartContainer
4. Apply Qova chart colors (white lines on black, yellow for primary data, red for alerts)
5. Include ChartTooltip with Qova styling
6. Ensure responsive sizing with min-h-[VALUE]
7. Use JetBrains Mono for all numeric labels on axes
8. Add accessibility layer
```

---

## Icon System: Phosphor Icons

### Package

```bash
bun add @phosphor-icons/react
```

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
}
```

### Import Patterns

```typescript
// Client components — use standard import
import { WalletIcon, ShieldCheckIcon, ChartLineUpIcon } from "@phosphor-icons/react";

// Server components (RSC) — use SSR submodule
import { WalletIcon } from "@phosphor-icons/react/ssr";
```

### Why Phosphor Over Lucide

1. **6 weight variants per icon** (thin, light, regular, bold, fill, duotone) — Lucide only has one. This lets us use weight to convey state: `regular` for inactive, `fill` for active, `bold` for emphasis.
2. **9,000+ icons** vs Lucide's ~1,400 — more coverage for financial, blockchain, and agent concepts.
3. **Duotone weight** — perfect for the Qova dashboard where we want secondary color fills on icons using yellow/red accents.
4. **React Context for global styling** — set default icon color and size once, every icon inherits.

### Qova Icon Conventions

```typescript
// Global icon context — wrap the entire dashboard
import { IconContext } from "@phosphor-icons/react";

<IconContext.Provider value={{
  color: "currentColor",  // Inherits text color
  size: 20,               // Default size
  weight: "regular",      // Default weight
  mirrored: false,
}}>
  {children}
</IconContext.Provider>
```

| Context | Weight | Color | Example |
|---------|--------|-------|---------|
| Navigation (inactive) | regular | gray-500 | Sidebar menu items |
| Navigation (active) | fill | yellow | Current page |
| Status: success | fill | green | Verified badge |
| Status: warning | fill | yellow | Budget approaching limit |
| Status: error | fill | red | Failed transaction |
| Status: info | regular | gray-400 | Tooltip triggers |
| Actions (buttons) | bold | white | Primary action icons |
| Decorative (cards) | duotone | gray-400 | Card header icons |
| Score indicators | fill | yellow/red/green | Based on score range |

### Icon Mapping for Qova Concepts

| Concept | Phosphor Icon | Weight |
|---------|---------------|--------|
| Agent | RobotIcon | regular |
| Wallet | WalletIcon | regular |
| Identity | FingerprintSimpleIcon | regular |
| Reputation/Score | ChartLineUpIcon | regular |
| Transaction | ArrowsLeftRightIcon | regular |
| Budget | PiggyBankIcon | regular |
| Alert | WarningIcon | fill |
| Verified | SealCheckIcon | fill |
| Credit | CreditCardIcon | regular |
| Shield/Security | ShieldCheckIcon | regular |
| Settings | GearSixIcon | regular |
| Dashboard/Overview | SquaresFourIcon | regular |
| Dispute | ScalesIcon | regular |
| API Key | KeyIcon | regular |
| Webhook | WebhooksLogoIcon | regular |
| Search | MagnifyingGlassIcon | regular |
| Filter | FunnelIcon | regular |
| Copy | CopyIcon | regular |
| External Link | ArrowSquareOutIcon | regular |
| Blockchain/Chain | LinkIcon | regular |
| Clock/Time | ClockIcon | regular |
| Trend Up | TrendUpIcon | bold |
| Trend Down | TrendDownIcon | bold |
| Score AAA-A | CrownIcon | fill + yellow |
| Score B-C | MinusCircleIcon | regular + gray |
| Score D | WarningCircleIcon | fill + red |

---

## shadcn/ui Component Architecture

### Installation

```bash
# Initialize shadcn in the dashboard
cd dashboard
npx shadcn@latest init

# Core components needed for Qova
npx shadcn@latest add button card badge input table tabs
npx shadcn@latest add dialog sheet dropdown-menu tooltip popover
npx shadcn@latest add select separator skeleton avatar
npx shadcn@latest add chart scroll-area command
npx shadcn@latest add sidebar navigation-menu breadcrumb
```

### Theming: Override shadcn Defaults

shadcn/ui uses CSS variables for theming. We override them entirely with the Qova palette:

```css
/* dashboard/src/app/globals.css */

@layer base {
  :root {
    /* Light mode */
    --background: 0 0% 100%;          /* white */
    --foreground: 0 0% 3.9%;          /* near-black */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 0%;               /* black buttons */
    --primary-foreground: 0 0% 100%;  /* white text on black */
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 48 96% 53%;             /* yellow */
    --accent-foreground: 0 0% 0%;     /* black on yellow */
    --destructive: 0 84% 60%;         /* red */
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 0%;
    --radius: 0.5rem;

    /* Chart colors */
    --chart-1: 48 96% 53%;            /* yellow — primary data */
    --chart-2: 0 0% 100%;             /* white — secondary data */
    --chart-3: 0 0% 63%;              /* gray — tertiary */
    --chart-4: 0 84% 60%;             /* red — alert data */
    --chart-5: 142 71% 45%;           /* green — positive data */
  }

  .dark {
    --background: 0 0% 3.9%;          /* near-black */
    --foreground: 0 0% 98%;           /* near-white */
    --card: 0 0% 7%;                  /* dark card */
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;              /* white buttons */
    --primary-foreground: 0 0% 3.9%;  /* black text on white */
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 48 96% 53%;             /* yellow stays the same */
    --accent-foreground: 0 0% 0%;
    --destructive: 0 84% 60%;         /* red stays the same */
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;

    --chart-1: 48 96% 53%;            /* yellow */
    --chart-2: 0 0% 98%;              /* white */
    --chart-3: 0 0% 45%;              /* gray */
    --chart-4: 0 84% 60%;             /* red */
    --chart-5: 142 71% 45%;           /* green */
  }
}
```

---

## Chart System

### Built With: shadcn Chart + Recharts

All charts use shadcn's `<ChartContainer>` wrapper around Recharts components. This ensures consistent theming and accessibility.

### Qova Chart Types

**1. Reputation Score Gauge**
- Custom radial chart showing 0-1000 score
- Color transitions: Red (0-400) → Yellow (400-700) → Green (700-1000)
- Large JetBrains Mono score number in center
- Letter grade below (AAA, AA, A, BBB, BB, B, CCC, CC, C, D)

**2. Score Trend Line**
- Area chart with gradient fill
- X-axis: time (days/weeks/months)
- Y-axis: score (0-1000)
- Yellow line with yellow-muted fill underneath
- Red horizontal threshold line at 400 (minimum viable score)
- Tooltip shows exact score + date + change from previous

**3. Transaction Volume Bar Chart**
- Vertical bar chart
- X-axis: time periods
- Y-axis: transaction count or volume in USDC
- White bars for successful, red bars for disputed/failed
- Stacked option for multi-agent fleet views

**4. Reputation Factor Radar**
- Radar/spider chart showing the 7 scoring factors
- Payment reliability, service quality, response time, dispute rate,
  transaction volume, account age, counterparty diversity
- White outline for current scores, yellow fill for strengths

**5. Agent Fleet Overview**
- Horizontal bar chart showing all agents ranked by score
- Color-coded bars (green/yellow/red based on score range)
- Agent name on Y-axis, score on X-axis
- Click to navigate to agent detail

**6. Real-Time Transaction Feed**
- Not a chart — a live-updating table using Convex subscriptions
- Columns: Time, From Agent, To Agent, Amount, Status, Score Impact
- Status badges: green (success), yellow (pending), red (failed/disputed)
- Phosphor icons for status indicators

### Chart Component Pattern

```typescript
"use client";

import { ChartLineUpIcon } from "@phosphor-icons/react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig, ChartContainer,
  ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  score: {
    label: "Qova Score",
    color: "hsl(var(--chart-1))",  // Yellow
  },
  threshold: {
    label: "Minimum",
    color: "hsl(var(--chart-4))",  // Red
  },
} satisfies ChartConfig;

export function ScoreTrendChart({ data }: { data: ScoreDataPoint[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <ChartLineUpIcon size={20} weight="bold" className="text-yellow-400" />
        <div>
          <CardTitle className="font-mono text-sm">Reputation Trend</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart accessibilityLayer data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 1000]}
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="score"
              type="monotone"
              fill="var(--color-score)"
              fillOpacity={0.15}
              stroke="var(--color-score)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

---

## Dashboard Page Layouts

### Sidebar Navigation (shadcn Sidebar)

```
┌──────────────┬──────────────────────────────────────┐
│              │                                       │
│  [Qova Logo] │  Breadcrumb: Dashboard > Agent Detail │
│              │                                       │
│  ─────────── │  ┌───────────┐  ┌───────────┐        │
│              │  │ Score     │  │ 24h Volume│        │
│  ▣ Overview  │  │ 847 (A)   │  │ $12,430   │        │
│  ◎ Agents    │  └───────────┘  └───────────┘        │
│  ↔ Txns      │                                       │
│  ↑ Reputation│  ┌─────────────────────────────┐      │
│  ⚙ Settings  │  │ Score Trend Chart           │      │
│              │  │ (Area chart, 30 days)       │      │
│  ─────────── │  └─────────────────────────────┘      │
│              │                                       │
│  API Keys    │  ┌──────────┐  ┌──────────────┐      │
│  Webhooks    │  │ Factors  │  │ Recent Txns  │      │
│  Docs ↗      │  │ (Radar)  │  │ (Table)      │      │
│              │  └──────────┘  └──────────────┘      │
│              │                                       │
└──────────────┴──────────────────────────────────────┘
```

### Page Specifications

**Overview Page** (`/dashboard`)
- Metric cards: Total agents, Average score, 24h transaction volume, Active alerts
- Fleet score distribution chart (horizontal bars)
- Recent transactions table (last 10)
- Alert banner for any agents with score drops

**Agents Page** (`/dashboard/agents`)
- Searchable, filterable table of all agents
- Columns: Name, Score, Grade, 24h Txns, Status, Created
- Click row → Agent Detail page
- "Create Agent" button (yellow accent)

**Agent Detail Page** (`/dashboard/agents/[id]`)
- Score gauge (large, centered)
- Score trend chart (30-day area chart)
- Factor breakdown (radar chart)
- Transaction history (paginated table)
- Budget utilization (progress bar)
- Identity details (ERC-8004 metadata)

**Transactions Page** (`/dashboard/transactions`)
- Full transaction log with filters
- Filters: date range, agent, status, amount range
- Export to CSV
- Real-time updates via Convex subscription

**Reputation Page** (`/dashboard/reputation`)
- Score comparison across agents (bar chart)
- Historical score trends (multi-line chart)
- Factor analysis (grouped radar charts)
- Scoring methodology explanation

**Settings Page** (`/dashboard/settings`)
- API key management (create, revoke, view usage)
- Webhook configuration
- Notification preferences
- Account settings (wallet linking via Clerk)
- Theme toggle (dark/light)

---

## Updated UI Designer Subagent

```markdown
---
name: ui-designer
description: >
  Frontend design specialist for the Qova Dashboard.
  Use for creating UI components, layouts, charts, and visual design.
  Expert in Next.js 15, React 19, Tailwind v4, shadcn/ui (via MCP),
  Phosphor Icons, Recharts, and the Qova monochrome+accent design system.
  ALWAYS uses shadcn MCP to verify component APIs before implementation.
  ALWAYS uses Phosphor icons, NEVER Lucide.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---

You are a senior frontend engineer and designer building the Qova Dashboard.

## Design System: Monochrome + Signal Accents

The Qova UI is black and white with yellow and red accents for icons and
functional signals. No decorative color. Every color communicates meaning.

- Background: Pure black (dark mode) or pure white (light mode)
- Text: White on black, black on white. No gray text for primary content.
- Cards: Slightly elevated gray (gray-800 dark, gray-50 light)
- Yellow (#FACC15): Active states, warnings, primary data, CTA buttons, in-progress
- Red (#EF4444): Errors, low scores, critical alerts, destructive actions
- Green (#22C55E): Success only — confirmations, high scores, verified badges
- Gray scale: Borders, secondary text, disabled states, dividers

## Icon System: Phosphor Icons ONLY

Package: @phosphor-icons/react
- NEVER use Lucide icons. NEVER import from lucide-react.
- Use SSR imports for server components: @phosphor-icons/react/ssr
- Default weight: regular. Use fill for active/selected states.
- Use duotone weight for decorative card icons.
- Icon size: 20px default, 16px for inline, 24px for headers, 32px for hero.

## Component Library: shadcn/ui via MCP

ALWAYS use the shadcn MCP server to verify component props before writing code.
NEVER guess at shadcn component APIs — query the MCP server first.

Workflow:
1. Query: "use shadcn to list components" or "use shadcn to get info about [component]"
2. Verify the exact TypeScript interface
3. Install: npx shadcn@latest add [component]
4. Implement with Qova theming

## Charts: shadcn Chart + Recharts

All charts use the shadcn Chart component wrapping Recharts.
- Install: npx shadcn@latest add chart
- ChartContainer for responsive sizing (always set min-h)
- ChartTooltip + ChartTooltipContent for tooltips
- ChartConfig for color mapping via CSS variables
- JetBrains Mono for all axis labels and numeric values
- Yellow for primary data series, white for secondary, red for alerts

## Typography
- UI text: Inter (--font-sans)
- Scores, numbers, code: JetBrains Mono (--font-mono)
- Scores are ALWAYS displayed in JetBrains Mono Bold

## Layout Standards
- Dark mode FIRST. Light mode is secondary.
- Sidebar navigation using shadcn Sidebar component
- Max content width: 1280px, centered
- Card-based layout with consistent 16px gap
- Responsive: mobile-first, breakpoints at sm/md/lg/xl
- Loading: skeleton screens (shadcn Skeleton), never spinners
- Empty states: Phosphor icon (duotone, 48px) + message + CTA

## Component Patterns
- All components are Server Components by default
- Add "use client" only when interactivity is needed
- Wrap client interactivity in the smallest possible component
- All forms use controlled components with Zod validation
- Error boundaries around every data-fetching component
- Optimistic updates for Convex mutations

## What You Never Do
- NEVER import from lucide-react — use @phosphor-icons/react
- NEVER use color decoratively — every color must have functional meaning
- NEVER create charts without ChartContainer from shadcn
- NEVER skip loading, error, or empty states
- NEVER use inline styles — Tailwind classes only
- NEVER hardcode colors — use CSS variables or Tailwind theme
- NEVER create components without TypeScript props interface
- NEVER guess at shadcn component APIs — use the MCP server

## Integration Reference for Dashboard
See docs/integrations/ for:
- convex.md — Real-time queries, mutations, Convex + Clerk auth
- clerk.md — SIWE auth, middleware, user metadata
- phosphor-icons.md — Import patterns, SSR usage, weight conventions
- shadcn-ui.md — Component installation, theming, chart patterns
- recharts.md — Chart types, accessibility, responsive containers
```

---

## Integration Reference Additions

### docs/integrations/phosphor-icons.md

```markdown
# Phosphor Icons Integration Reference

## Version
Package: @phosphor-icons/react@latest
Docs: https://github.com/phosphor-icons/react
Icon Browser: https://phosphoricons.com
Last verified: 2026-02-26

## What We Use It For
All iconography across the Qova Dashboard. Replaced Lucide for
superior weight variants, larger icon set, and duotone support.

## Key API Surfaces
- Individual icon imports: `import { WalletIcon } from "@phosphor-icons/react"`
- SSR imports: `import { WalletIcon } from "@phosphor-icons/react/ssr"`
- IconContext.Provider for global styling
- Props: color, size, weight, mirrored, alt

## Official Patterns We Follow
- Tree-shaking via named imports (never import *)
- IconContext.Provider wrapping the app for defaults
- SSR submodule for all React Server Components
- Weight toggling for state indication (regular → fill)

## Gotchas & Known Issues
- React 19 peer dependency: install with --legacy-peer-deps if needed with bun
- SSR imports do NOT support IconContext (must pass props directly)
- Next.js requires optimizePackageImports config for bundle size

## Our Implementation
- Global context: dashboard/src/app/providers.tsx
- Icon mapping: dashboard/src/lib/icons.ts
- Used in: all dashboard components

## Test Strategy
- Visual regression tests for icon rendering
- Snapshot tests for icon context inheritance
```

### docs/integrations/shadcn-charts.md

```markdown
# shadcn Charts Integration Reference

## Version
Component: chart (via shadcn CLI)
Underlying: recharts@latest
Docs: https://ui.shadcn.com/docs/components/radix/chart
Chart Library: https://www.shadcn.io/charts
Last verified: 2026-02-26

## What We Use It For
All data visualization in the Qova Dashboard — score trends,
transaction volumes, factor breakdowns, fleet comparisons.

## Key API Surfaces
- ChartContainer: Responsive wrapper, requires min-h
- ChartConfig: Color mapping type for theming
- ChartTooltip + ChartTooltipContent: Styled tooltips
- ChartLegend + ChartLegendContent: Styled legends
- All Recharts components (Bar, Line, Area, Pie, Radar, etc.)

## Official Patterns We Follow
- Composition: build with Recharts components, add shadcn wrappers as needed
- ChartConfig satisfies ChartConfig type assertion
- CSS variable colors: "hsl(var(--chart-1))"
- accessibilityLayer prop on all chart components
- CartesianGrid vertical={false} for cleaner look

## Gotchas & Known Issues
- Recharts v3 support is coming but not yet in shadcn (as of Feb 2026)
- Must set min-h on ChartContainer or chart won't render
- ChartTooltipContent renders outside the chart container — z-index matters
- Colors must be defined in both :root and .dark for theme switching

## Our Implementation
- Chart components: dashboard/src/components/charts/
- Chart config: dashboard/src/lib/chart-config.ts
- Used in: Overview, Agent Detail, Reputation pages

## Test Strategy
- Snapshot tests for chart rendering with mock data
- Interaction tests for tooltip behavior
- Responsive tests at sm/md/lg breakpoints
```

---

## MCP Configuration Summary for Claude Code

The complete `.mcp.json` for the Qova project:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.shadcn.io/api/mcp"]
    },
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["-y", "shadcn-ui-mcp-server"]
    }
  }
}
```

Claude Code CLI setup:
```bash
# Add official shadcn MCP
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp

# Add community shadcn MCP for deeper component access
claude mcp add shadcn-ui-server -- npx -y shadcn-ui-mcp-server

# Verify
claude /mcp
```

---

## Updated Integration Registry Entry

Add to docs/integrations/REGISTRY.md:

```
| Service | Package | Version | Used In | Reference Doc | Last Verified |
|---------|---------|---------|---------|---------------|---------------|
| Phosphor Icons | @phosphor-icons/react | latest | dashboard/ | [link] | 2026-02-26 |
| shadcn/ui | (copy-paste) | latest | dashboard/ | [link] | 2026-02-26 |
| shadcn Charts | (via shadcn CLI) | latest | dashboard/ | [link] | 2026-02-26 |
| Recharts | recharts | latest | dashboard/ | [link] | 2026-02-26 |
| shadcn MCP | mcp-remote | latest | .mcp.json | [link] | 2026-02-26 |
```

---

## Summary of UI Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Color system | Black/white + yellow/red accents | Matches logo identity, every color has functional meaning |
| Icons | Phosphor (@phosphor-icons/react) | 6 weights, 9000+ icons, duotone for accents, RSC support |
| Components | shadcn/ui via MCP server | Copy-paste ownership, Radix primitives, accessible by default |
| Charts | shadcn Chart + Recharts | Composition-based, CSS variable theming, 53 pre-built patterns |
| Component access | shadcn MCP in Claude Code | Real-time component docs, no hallucinated props |
| Fonts | Inter (UI) + JetBrains Mono (data) | Clean sans-serif + monospace for financial numbers |
| Theme | Dark mode first | Matches black logo, preferred by developer audience |
| Layout | Sidebar + card grid | Standard dashboard pattern, shadcn Sidebar component |

**ADR required:** docs/decisions/011-ui-design-system.md