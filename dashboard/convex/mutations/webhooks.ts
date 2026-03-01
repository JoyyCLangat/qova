import { v } from "convex/values";
import { mutation } from "../_generated/server";

/** Create a new webhook endpoint. */
export const create = mutation({
  args: {
    userId: v.string(),
    url: v.string(),
    events: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate webhook secret
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let secret = "whsec_";
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }

    const id = await ctx.db.insert("webhooks", {
      userId: args.userId,
      url: args.url,
      events: args.events,
      secret,
      isActive: true,
      createdAt: Date.now(),
    });

    return { id, secret };
  },
});

/** Toggle webhook active state. */
export const toggle = mutation({
  args: { id: v.id("webhooks"), isActive: v.boolean() },
  handler: async (ctx, { id, isActive }) => {
    await ctx.db.patch(id, { isActive });
  },
});

/** Delete a webhook. */
export const remove = mutation({
  args: { id: v.id("webhooks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
