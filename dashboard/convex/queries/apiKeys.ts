import { v } from "convex/values";
import { query } from "../_generated/server";

/** List API keys for a user (never returns the full key, only prefix). */
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
