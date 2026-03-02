import { v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * SHA-256 hash a string. Uses the Web Crypto API available in Convex runtime.
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Create a new API key. Returns the full key ONCE. */
export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    scopes: v.array(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify caller identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    if (identity.subject !== args.userId) throw new Error("Forbidden");

    // Generate a cryptographically random key
    const randomBytes = new Uint8Array(30);
    crypto.getRandomValues(randomBytes);
    const key =
      "qova_" +
      Array.from(randomBytes)
        .map((b) => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, 40);

    const keyPrefix = key.slice(0, 12);
    const keyHash = await sha256(key);

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const key = await ctx.db.get(id);
    if (!key || key.userId !== identity.subject) throw new Error("Forbidden");

    await ctx.db.patch(id, { isActive: false });
  },
});

/** Delete an API key permanently. */
export const remove = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const key = await ctx.db.get(id);
    if (!key || key.userId !== identity.subject) throw new Error("Forbidden");

    await ctx.db.delete(id);
  },
});
