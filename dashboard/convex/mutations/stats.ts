import { mutation } from "../_generated/server";

/** Recalculate and update system-wide stats from the user's agent data. Requires authentication. */
export const updateOverview = mutation({
	args: {},
	handler: async (ctx): Promise<void> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");

		// Stats are now computed on-the-fly in queries/stats.ts
		// This mutation is kept for backward compatibility but is a no-op.
	},
});
