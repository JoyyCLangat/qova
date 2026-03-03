import { query } from "../_generated/server";

/** Get overview stats computed from the authenticated user's agents. */
export const getOverview = query({
	args: {},
	handler: async (ctx): Promise<Record<string, string | number>> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return {
				totalAgents: 0,
				avgScore: 0,
				registeredCount: 0,
				topGrade: "N/A",
				lastSyncedAt: new Date().toISOString(),
			};
		}

		const agents = await ctx.db
			.query("agents")
			.withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
			.collect();

		const totalAgents = agents.length;
		const registeredCount = agents.filter((a) => a.isRegistered).length;
		const avgScore =
			totalAgents > 0
				? Math.round(agents.reduce((s, a) => s + a.score, 0) / totalAgents)
				: 0;
		const sorted = [...agents].sort((a, b) => b.score - a.score);
		const topGrade = sorted[0]?.grade ?? "N/A";

		return {
			totalAgents,
			avgScore,
			registeredCount,
			topGrade,
			lastSyncedAt: new Date().toISOString(),
		};
	},
});
