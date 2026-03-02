# Changelog

## [Unreleased] - Phase 7: Production Overhaul
### Added
- Web3 wallet connect (RainbowKit + wagmi) with Base Sepolia chain
- 10 shared Qova components: GradeBadge, StatusBadge, PageHeader, TabNav, FilterBar, SectionLabel, StatCard, EmptyState, AddressDisplay, QovaCard
- 9 new shadcn components: popover, radio-group, scroll-area, progress, alert, alert-dialog, collapsible, accordion, hover-card
- DM Sans typography system
- Warm off-white background (#F7F7F5) with complete light/dark color system
- Qova design system CSS variables (--bg-*, --text-*, --border-*, --status-*)
- Page subtitles on every dashboard page
- Metric tooltips and empty states
- walletAddress field on users schema
- linkWallet Convex mutation for wallet-user binding
- useWalletStatus hook
- CHANGELOG.md

### Changed
- Font stack from Inter/Sora to DM Sans
- Color system from oklch to hex values for consistency
- shadcn component icon library from lucide-react to @phosphor-icons/react

### Fixed
- Removed ALL shadow classes from shadcn components (zero-shadow rule)
- Replaced lucide-react imports with @phosphor-icons/react in accordion, radio-group
- API key hashing upgraded from djb2 to SHA-256
- API key generation upgraded from Math.random() to crypto.getRandomValues()
- seedDemoData and seedWorkflows changed to internalMutation (prevent public DB wipe)
- Auth checks added to all user-scoped Convex queries and mutations
- Ownership verification on API key revoke/remove, webhook toggle/remove
- Webhook secret stripped from query responses (masked version returned)
- API key hash stripped from query responses
- Notification create changed to internalMutation
- completeOnboarding uses ctx.auth instead of arbitrary clerkId parameter
- Webhook URL validation (HTTPS required)
- CRE mutation status value validation
- Ethereum address format validation on linkWallet

### Security
- 2 CRITICAL vulnerabilities fixed (insecure hashing, public seed mutations)
- 9 HIGH vulnerabilities fixed (missing auth, data exposure, input validation)
- 6 MEDIUM findings documented

## [0.6.0] - Phase 6B-E: Complete Platform
### Added
- CRE Scoring Engine dashboard (/cre) with 4 workflow cards
- Ecosystem Intelligence (/ecosystem) with macro stats and charts
- Rich Public Credit Reports (/verify/report/[address])
- Developer Tools: API keys management, webhooks, API docs playground
- Notification center (/alerts) with severity filtering
- Integration marketplace (/integrations) with 5+ provider cards
- Settings suite (general, team management, notifications)
- Semantic agent search in command palette
- Convex production data seeding (8 agents, 720+ score snapshots)

## [0.5.0] - Phase 6A: Auth & Core Interactions
### Added
- Clerk authentication (sign-in, sign-up, middleware)
- Onboarding wizard (4-step flow)
- Agent registration modal with address validation
- Command palette (Cmd+K) with fuzzy search
- Sidebar user footer with Clerk profile data
- Public verify page (no auth required)
- Badge API endpoint (/api/badge/[address])

## [0.4.0] - Phase 5: Dashboard Foundation
### Added
- 10 initial pages (overview, agents, scores, transactions, budgets, etc.)
- Convex real-time backend with 13 tables
- Zero-shadow design system
- Theme switching (light/dark/system)
- shadcn/ui component library
- Score ring SVG component with animation
- Recharts-based charts (score trend, distribution, activity)
- TanStack Table data tables
