import { v } from "convex/values";
import { mutation } from "../_generated/server";

/** Record a new CRE execution. Requires authentication. */
export const createExecution = mutation({
  args: {
    workflowId: v.string(),
    agentAddress: v.optional(v.string()),
    status: v.string(),
    inputScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Validate status
    const validStatuses = new Set(["running", "completed", "failed"]);
    if (!validStatuses.has(args.status)) {
      throw new Error(`Invalid status: ${args.status}`);
    }

    return await ctx.db.insert("creExecutions", {
      workflowId: args.workflowId,
      agentAddress: args.agentAddress,
      status: args.status,
      inputScore: args.inputScore,
      startedAt: Date.now(),
    });
  },
});

/** Update workflow status. Requires authentication. */
export const updateWorkflowStatus = mutation({
  args: {
    workflowId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { workflowId, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Validate status
    const validStatuses = new Set(["active", "paused", "error"]);
    if (!validStatuses.has(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const workflow = await ctx.db
      .query("creWorkflows")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", workflowId))
      .unique();

    if (workflow) {
      await ctx.db.patch(workflow._id, { status });
    }
  },
});
