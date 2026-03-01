import { v } from "convex/values";
import { mutation } from "../_generated/server";

/** Create a new API key. Returns the full key ONCE. */
export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    scopes: v.array(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate a random key
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "qova_";
    for (let i = 0; i < 40; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }

    const keyPrefix = key.slice(0, 12);
    // Simple hash for demo (in production, use crypto.subtle)
    const keyHash = key.split("").reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
    }, 0).toString(16);

    await ctx.db.insert("apiKeys", {
      userId: args.userId,
      name: args.name,
      keyPrefix,
      keyHash,
      scopes: args.scopes,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
      isActive: true,
    });

    return key; // Return full key only on creation
  },
});

/** Revoke an API key. */
export const revoke = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: false });
  },
});

/** Delete an API key permanently. */
export const remove = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
