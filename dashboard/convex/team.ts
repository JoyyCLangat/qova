import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		return await ctx.db
			.query("teamMembers")
			.withIndex("by_userId", (q) => q.eq("userId", identity.subject))
			.collect();
	},
});

export const invite = mutation({
	args: {
		email: v.string(),
		name: v.string(),
		role: v.string(),
	},
	handler: async (ctx, args): Promise<string> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		// Check for duplicate
		const existing = await ctx.db
			.query("teamMembers")
			.withIndex("by_userId", (q) => q.eq("userId", identity.subject))
			.collect();
		const dupe = existing.find(
			(m) => m.memberEmail.toLowerCase() === args.email.toLowerCase(),
		);
		if (dupe) throw new Error("User already invited");

		return await ctx.db.insert("teamMembers", {
			userId: identity.subject,
			memberEmail: args.email,
			memberName: args.name,
			role: args.role,
			status: "invited",
			invitedAt: Date.now(),
		});
	},
});

export const updateRole = mutation({
	args: {
		id: v.id("teamMembers"),
		role: v.string(),
	},
	handler: async (ctx, { id, role }): Promise<void> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const member = await ctx.db.get(id);
		if (!member || member.userId !== identity.subject)
			throw new Error("Not found");
		await ctx.db.patch(id, { role });
	},
});

export const removeMember = mutation({
	args: { id: v.id("teamMembers") },
	handler: async (ctx, { id }): Promise<void> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const member = await ctx.db.get(id);
		if (!member || member.userId !== identity.subject)
			throw new Error("Not found");
		await ctx.db.delete(id);
	},
});
