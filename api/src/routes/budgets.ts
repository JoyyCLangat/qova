/**
 * Budget management endpoints.
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import type { Address } from "viem";
import { getCached, setCache } from "../middleware/cache.js";
import { validateAddress, validateBody } from "../middleware/validate.js";
import { CheckBudgetRequest, RecordSpendRequest, SetBudgetRequest } from "../schemas/request.js";
import { getQovaClient } from "../services/chain.js";
import { enrichBudgetStatus } from "../services/enrichment.js";
import type { AppEnv } from "../types/env.js";

export const budgetRoutes = new Hono<AppEnv>();

/** GET /api/budgets/:address -- Budget status */
budgetRoutes.get("/:address", validateAddress(), async (c) => {
	const address = c.req.param("address");
	const cacheKey = `budget:${address}`;
	const cached = getCached<Record<string, unknown>>(cacheKey);
	if (cached) return c.json(cached);

	const client = getQovaClient();
	const status = await client.getBudgetStatus(address as Address);
	const enriched = enrichBudgetStatus(address, status);

	setCache(cacheKey, enriched, 30);
	return c.json(enriched);
});

/** POST /api/budgets/:address/set -- Set budget limits (write) */
budgetRoutes.post("/:address/set", validateAddress(), validateBody(SetBudgetRequest), async (c) => {
	const address = c.req.param("address");
	const { dailyLimit, monthlyLimit, perTxLimit } = c.get("body") as {
		dailyLimit: string;
		monthlyLimit: string;
		perTxLimit: string;
	};
	const client = getQovaClient();
	const txHash = await client.setBudget(
		address as Address,
		BigInt(dailyLimit),
		BigInt(monthlyLimit),
		BigInt(perTxLimit),
	);
	return c.json({ txHash, agent: address });
});

/** POST /api/budgets/:address/check -- Check if amount is within budget */
budgetRoutes.post(
	"/:address/check",
	validateAddress(),
	validateBody(CheckBudgetRequest),
	async (c) => {
		const address = c.req.param("address");
		const { amount } = c.get("body") as { amount: string };
		const client = getQovaClient();
		const withinBudget = await client.checkBudget(address as Address, BigInt(amount));
		return c.json({ agent: address, withinBudget, amount });
	},
);

/** POST /api/budgets/:address/spend -- Record a spend (write) */
budgetRoutes.post(
	"/:address/spend",
	validateAddress(),
	validateBody(RecordSpendRequest),
	async (c) => {
		const address = c.req.param("address");
		const { amount } = c.get("body") as { amount: string };
		const client = getQovaClient();
		const txHash = await client.recordSpend(address as Address, BigInt(amount));
		return c.json({ txHash, agent: address });
	},
);
