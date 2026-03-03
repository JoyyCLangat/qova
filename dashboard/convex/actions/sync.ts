"use node";

import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { v } from "convex/values";

function computeGrade(score: number): string {
  const thresholds = [
    { grade: "AAA", min: 950 },
    { grade: "AA", min: 900 },
    { grade: "A", min: 850 },
    { grade: "BBB", min: 750 },
    { grade: "BB", min: 650 },
    { grade: "B", min: 550 },
    { grade: "CCC", min: 450 },
    { grade: "CC", min: 350 },
    { grade: "C", min: 250 },
    { grade: "D", min: 0 },
  ];
  for (const { grade, min } of thresholds) {
    if (score >= min) return grade;
  }
  return "D";
}

function computeGradeColor(score: number): string {
  if (score >= 700) return "#22C55E";
  if (score >= 400) return "#FACC15";
  return "#EF4444";
}

/**
 * Sync a single agent: record a fresh score snapshot from current Convex data.
 * No external API calls -- operates entirely on Convex data.
 */
export const syncAgent = action({
  args: { address: v.string() },
  handler: async (ctx, { address }): Promise<{ synced: boolean }> => {
    const agent = await ctx.runQuery(api.queries.agents.getByAddress, {
      address,
    });

    if (!agent) {
      return { synced: false };
    }

    // Record a score snapshot from the current state
    const grade = computeGrade(agent.score);
    const gradeColor = computeGradeColor(agent.score);

    await ctx.runMutation(api.mutations.scores.addSnapshot, {
      agent: agent.address,
      score: agent.score,
      grade,
      gradeColor,
    });

    return { synced: true };
  },
});

/**
 * Sync all user's agents: record score snapshots for each.
 * No external API calls -- operates entirely on Convex data.
 */
export const syncAllAgents = action({
  args: {},
  handler: async (ctx): Promise<{ total: number; synced: number; errors: number }> => {
    const agents = await ctx.runQuery(api.queries.agents.list, {});

    let synced = 0;
    let errors = 0;

    for (const agent of agents) {
      try {
        await ctx.runAction(api.actions.sync.syncAgent, {
          address: agent.address,
        });
        synced++;
      } catch {
        errors++;
      }
    }

    return { total: agents.length, synced, errors };
  },
});
