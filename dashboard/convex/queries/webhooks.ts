import { v } from "convex/values";
import { query } from "../_generated/server";

/** List webhooks for a user. */
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("webhooks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
