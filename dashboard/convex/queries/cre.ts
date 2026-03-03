import { v } from "convex/values";
import { query } from "../_generated/server";

/** List all CRE workflows. Requires authentication. */
export const listWorkflows = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		return await ctx.db.query("creWorkflows").collect();
	},
});

/** Get a single workflow by its workflowId. Requires authentication. */
export const getWorkflow = query({
	args: { workflowId: v.string() },
	handler: async (ctx, { workflowId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;
		return await ctx.db
			.query("creWorkflows")
			.withIndex("by_workflow_id", (q) => q.eq("workflowId", workflowId))
			.unique();
	},
});

/** Get executions for a specific workflow, newest first. Requires authentication. */
export const getExecutions = query({
	args: {
		workflowId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { workflowId, limit }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const cap = limit ?? 50;
		return await ctx.db
			.query("creExecutions")
			.withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
			.order("desc")
			.take(cap);
	},
});

/** Get recent executions across all workflows for the timeline. Requires authentication. */
export const getRecentExecutions = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const cap = limit ?? 20;
		return await ctx.db
			.query("creExecutions")
			.order("desc")
			.take(cap);
	},
});

/** Get execution stats for a workflow. Requires authentication. */
export const getWorkflowStats = query({
	args: { workflowId: v.string() },
	handler: async (ctx, { workflowId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return { total: 0, completed: 0, failed: 0, running: 0, avgDurationMs: 0, successRate: 0 };
		}

		const executions = await ctx.db
			.query("creExecutions")
			.withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
			.collect();

		const total = executions.length;
		const completed = executions.filter((e) => e.status === "completed");
		const failed = executions.filter((e) => e.status === "failed");
		const running = executions.filter((e) => e.status === "running");

		const avgDuration =
			completed.length > 0
				? Math.round(
						completed.reduce((sum, e) => sum + (e.durationMs ?? 0), 0) /
							completed.length,
					)
				: 0;

		return {
			total,
			completed: completed.length,
			failed: failed.length,
			running: running.length,
			avgDurationMs: avgDuration,
			successRate: total > 0 ? Math.round((completed.length / total) * 100) : 0,
		};
	},
});
