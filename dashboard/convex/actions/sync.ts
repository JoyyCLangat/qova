import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { v } from "convex/values";

const API_URL =
  process.env.QOVA_API_URL ?? "http://localhost:3001/api";

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

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

interface AgentDetailsResponse {
  agent: string;
  score: number;
  grade: string;
  gradeColor: string;
  scoreFormatted: string;
  scorePercentage: number;
  lastUpdated: string;
  updateCount: number;
  isRegistered: boolean;
  addressShort: string;
  explorerUrl: string;
}

interface TxStatsResponse {
  agent: string;
  totalCount: number;
  totalVolume: string;
  successRate: string;
  lastActivity: string;
}

interface BudgetResponse {
  agent: string;
  config: {
    dailyLimit: string;
    monthlyLimit: string;
    perTxLimit: string;
  };
  usage: {
    dailySpent: string;
    monthlySpent: string;
  };
}

/**
 * Fetch all data for a single agent from the REST API and upsert into Convex.
 * Pulls agent details, transaction stats, and budget data.
 */
export const syncAgent = action({
  args: { address: v.string() },
  handler: async (ctx, { address }): Promise<{ synced: boolean }> => {
    // Fetch agent details
    let details: AgentDetailsResponse;
    try {
      details = await apiGet<AgentDetailsResponse>(`/agents/${address}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to fetch agent ${address}: ${msg}`);
    }

    // Fetch tx stats (non-critical -- continue if fails)
    let txStats: TxStatsResponse | null = null;
    try {
      txStats = await apiGet<TxStatsResponse>(
        `/transactions/${address}/stats`
      );
    } catch {
      // Tx stats may not exist yet
    }

    // Fetch budget (non-critical -- continue if fails)
    let budget: BudgetResponse | null = null;
    try {
      budget = await apiGet<BudgetResponse>(`/budgets/${address}`);
    } catch {
      // Budget may not be set yet
    }

    // Upsert agent with all collected data
    await ctx.runMutation(api.mutations.agents.upsertAgent, {
      address: details.agent,
      score: details.score,
      grade: details.grade,
      gradeColor: details.gradeColor,
      scoreFormatted: details.scoreFormatted,
      scorePercentage: details.scorePercentage,
      lastUpdated: details.lastUpdated,
      updateCount: details.updateCount,
      isRegistered: details.isRegistered,
      addressShort: details.addressShort,
      explorerUrl: details.explorerUrl,
      ...(txStats && {
        totalTxCount: txStats.totalCount,
        totalVolume: txStats.totalVolume,
        successRate: txStats.successRate,
        lastActivity: txStats.lastActivity,
      }),
      ...(budget && {
        dailyLimit: budget.config.dailyLimit,
        monthlyLimit: budget.config.monthlyLimit,
        perTxLimit: budget.config.perTxLimit,
        dailySpent: budget.usage.dailySpent,
        monthlySpent: budget.usage.monthlySpent,
      }),
    });

    // Record a score snapshot
    await ctx.runMutation(api.mutations.scores.addSnapshot, {
      agent: details.agent,
      score: details.score,
      grade: details.grade,
      gradeColor: details.gradeColor,
    });

    return { synced: true };
  },
});

/**
 * Fetch the full agent list from the API, sync each agent, and
 * recalculate system-wide stats.
 */
export const syncAllAgents = action({
  args: {},
  handler: async (ctx): Promise<{ total: number; synced: number; errors: number }> => {
    // Fetch the agent list from the API
    const { agents } = await apiGet<{ agents: string[]; total: number }>(
      "/agents"
    );

    let synced = 0;
    let errors = 0;

    // Sync each agent sequentially to avoid overwhelming the API
    for (const address of agents) {
      try {
        await ctx.runAction(api.actions.sync.syncAgent, { address });
        synced++;
      } catch {
        errors++;
      }
    }

    // Recalculate system stats after full sync
    await ctx.runMutation(api.mutations.stats.updateOverview, {
      totalAgents: agents.length,
      lastSyncedAt: new Date().toISOString(),
    });

    return { total: agents.length, synced, errors };
  },
});
