import { v } from "convex/values";
import { query } from "../_generated/server";

/** List API keys for a user (never returns the full key hash). */
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Verify caller identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== userId) return [];

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Strip keyHash from response -- never expose to client
    return keys.map(({ keyHash, ...rest }) => rest);
  },
});
