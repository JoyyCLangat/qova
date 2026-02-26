description: Compile and validate all packages
---
Run the full build pipeline:
1. `bun install` (if needed)
2. `cd contracts && forge build`
3. `bun run build` (turborepo builds sdk, api, dashboard)
4. `bun run check` (biome lint + format)
Report any errors. Do not proceed past errors.
