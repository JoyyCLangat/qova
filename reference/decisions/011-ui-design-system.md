# ADR-011: Monochrome + Signal Accent Design System

**Date:** 2026-02-26
**Status:** Accepted
**Author:** Qova Engineering

## Context
Qova's dashboard displays financial trust data. The UI needs to communicate numeric severity (scores, risk levels, alerts) without visual noise.

## Decision
Adopt a monochrome-first design system with functional color accents:
- **Base**: Black (#000000) / White (#FFFFFF)
- **Yellow (#FACC15)**: Active states, warnings, CTA buttons, primary data
- **Red (#EF4444)**: Errors, low scores, critical alerts
- **Green (#22C55E)**: Success confirmations and high scores only
- **Typography**: Inter (UI), JetBrains Mono (numbers/scores/code)
- **Icons**: Phosphor Icons (never Lucide)

## Alternatives Considered
1. **Brand-color-heavy palette**: More visually distinctive but risks information overload on data-dense screens.
2. **Blue-based financial theme**: Traditional but doesn't differentiate Qova from legacy fintech.

## Consequences
- **Gained**: Every color carries meaning, reduced cognitive load, professional financial aesthetic, accessibility (high contrast).
- **Sacrificed**: Less "fun" visual identity, potential perception as austere. Mitigated by thoughtful use of yellow as energetic accent.
