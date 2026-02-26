# Qova Dashboard -- Design Decisions

## Aesthetic: Institutional Minimal

Qova communicates financial trust and precision. The visual language draws from Linear (line-based hierarchy), Vercel (border-driven layout), and Stripe (data density through typography). Every pixel earns its place through function, not decoration.

**Why lines not shadows:** Shadows imply physical elevation -- a skeuomorphic metaphor that conflicts with the precision of financial data. Borders are structural and honest. A 1px line says "this is a boundary" without pretending the element floats above the page. This creates a flatter, more data-dense interface where hierarchy comes from typography and color intensity, not simulated depth.

**Why restraint not excess:** Qova displays credit ratings for AI agents. Judges and users must trust the data instantly. Visual noise (gradients, shadows, rounded-full containers, decorative color) undermines that trust. Restraint signals confidence.

## Typography

- **Heading: Sora** -- Geometric, modern, with subtle character that distinguishes it from the ubiquitous Inter. The wide letterforms communicate authority and stability. Used for page titles, section headers, and the grade letter inside ScoreRing.
- **Body: Geist Sans** -- Vercel's house font. Designed for UI readability at small sizes and high data density. Excellent number rendering. Used for all body text, labels, and descriptions.
- **Mono: JetBrains Mono** -- Purpose-built for code and data. Distinguished zero (0) and O, clear l/1/I differentiation. Used for Ethereum addresses, transaction hashes, numeric scores, and formatted values.

## Color Architecture

Colors are functional, never decorative. Every color has exactly one semantic meaning.

| Token | Value | Meaning |
|-------|-------|---------|
| `--primary` | hsl(239, 84%, 67%) | Interactive elements: buttons, links, focus rings |
| `--score-green` | hsl(142, 71%, 45%) | Score >= 700: grades AAA through BBB |
| `--score-yellow` | hsl(48, 96%, 53%) | Score 400-699: grades BB through CCC |
| `--score-red` | hsl(0, 84%, 60%) | Score < 400: grades CC, C, D |
| `--destructive` | hsl(0, 84%, 60%) | Error states, destructive actions |
| `--border` | Light: hsl(240,6%,90%) / Dark: hsl(240,14%,16%) | Structural lines |
| `--border-emphasis` | Light: hsl(240,6%,78%) / Dark: hsl(240,14%,24%) | Active/focused elements |
| `--muted-foreground` | Light: hsl(240,4%,46%) / Dark: hsl(215,20%,55%) | Secondary text, timestamps |

**Score colors are ONLY for score-related elements.** Green never means "success" generically -- it means "high reputation score." This creates a strong mental association between color and meaning.

## Border System

- **1px (`border`):** Default structural border. Cards, table dividers, sidebar edge, input fields.
- **2px (`border-2 border-border-emphasis`):** Emphasis. Active navigation item, focused input, selected card.
- **3px left-border (`border-l-[3px]`):** Score accent indicator on agent cards and stat cards. Color matches the agent's score tier.
- **0px between adjacent cards:** Use `gap-4` spacing instead of borders between grid items.

**Rules:**
- Maximum border-radius: `rounded-lg` (0.5rem). Never `rounded-2xl` or `rounded-3xl`.
- `rounded-full` ONLY on: status dots, avatar circles, progress bar tracks/fills.
- Sidebar: `border-r` to separate from content area.
- Inputs: `border` default, `border-2 border-ring` on focus.

## Spacing Rhythm

| Context | Class | px |
|---------|-------|----|
| Within components | `gap-1` to `gap-2` | 4-8 |
| Card padding | `p-4` (standard), `p-6` (hero) | 16-24 |
| Between cards | `gap-4` | 16 |
| Between sections | `gap-6` to `gap-8` | 24-32 |
| Page padding | `px-6 py-6` | 24 |
| Sidebar width | `w-60` (expanded), `w-16` (collapsed) | 240/64 |

## Component Hierarchy

- **Level 1 (Hero):** ScoreRing, page titles. `text-3xl`/`text-4xl`, `font-heading`, `font-bold`. Maximum contrast.
- **Level 2 (Primary):** Stat card values, table headers. `text-xl`/`text-2xl`, `font-semibold`. Strong contrast.
- **Level 3 (Secondary):** Table cells, form labels. `text-sm`/`text-base`, `font-normal`. Default contrast.
- **Level 4 (Tertiary):** Timestamps, IDs, metadata. `text-xs`/`text-sm`, `text-muted-foreground`. Muted.

## Anti-Patterns (NEVER use)

- `box-shadow` of any kind (including `shadow-sm`, `shadow-md`, etc.)
- `rounded-full` on containers (only avatars, dots, progress bars)
- `rounded-2xl` or `rounded-3xl` on anything
- Gradient backgrounds on cards or sections
- Colored backgrounds on entire sections
- More than 2 font weights visible simultaneously in the same component
- Decorative color (color must always communicate data)
- `backdrop-filter: blur()` or `filter: drop-shadow()`
- Inline styles (Tailwind utilities only)
