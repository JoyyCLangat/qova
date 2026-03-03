import { query } from "../_generated/server";
import { v } from "convex/values";

/** Get the most recent N activity items for the authenticated user, newest first. */
export const getRecent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const cap = limit ?? 20;
		const items = await ctx.db
			.query("activity")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.order("desc")
			.take(cap);
		return items;
	},
});

/** Get activity for a specific agent address (must be owned by the user). */
export const getByAgent = query({
	args: { agent: v.string(), limit: v.optional(v.number()) },
	handler: async (ctx, { agent, limit }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const cap = limit ?? 50;
		const normalized = agent.toLowerCase();

		// Verify the agent belongs to the user
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();
		const owned = agents.some((a) => a.address.toLowerCase() === normalized);
		if (!owned) return [];

		const items = await ctx.db
			.query("activity")
			.withIndex("by_agent")
			.collect();
		return items
			.filter((item) => item.agent.toLowerCase() === normalized)
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, cap);
	},
});
