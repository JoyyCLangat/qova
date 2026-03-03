import { query } from "../_generated/server";
import { v } from "convex/values";

/** List all agents owned by the authenticated user, sorted by score descending. */
export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		agents.sort((a, b) => b.score - a.score);
		return agents;
	},
});

/** Get a single agent by Ethereum address (must be owned by the user). */
export const getByAddress = query({
	args: { address: v.string() },
	handler: async (ctx, { address }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;

		const normalized = address.toLowerCase();
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		return agents.find((a) => a.address.toLowerCase() === normalized) ?? null;
	},
});

/** Get the top N agents by score for the authenticated user. */
export const getTopAgents = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const cap = limit ?? 10;
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		agents.sort((a, b) => b.score - a.score);
		return agents.slice(0, cap);
	},
});

/** Search agents by address substring (only user's agents). */
export const search = query({
	args: { term: v.string() },
	handler: async (ctx, { term }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		if (!term || term.length < 2) return [];

		const lower = term.toLowerCase();
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		return agents
			.filter((a) => a.address.toLowerCase().includes(lower))
			.sort((a, b) => b.score - a.score);
	},
});

/** List agents filtered by chain ID (user's agents only). */
export const listByChain = query({
	args: { chainId: v.number() },
	handler: async (ctx, { chainId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner_chain", (q) =>
				q.eq("ownerId", identity.subject).eq("chainId", chainId),
			)
			.collect();
		agents.sort((a, b) => b.score - a.score);
		return agents;
	},
});

/** Count agents per grade for distribution charts (user's agents only). */
export const countByGrade = query({
	args: {},
	handler: async (ctx): Promise<Record<string, number>> => {
		const identity = await ctx.auth.getUserIdentity();
		const grades = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"];
		const counts: Record<string, number> = {};
		for (const g of grades) counts[g] = 0;

		if (!identity) return counts;

		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		for (const agent of agents) {
			if (agent.grade in counts) {
				counts[agent.grade]++;
			}
		}
		return counts;
	},
});
