"use node";

import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { v } from "convex/values";

const API_URL =
  process.env.QOVA_API_URL ?? "http://localhost:3001/api";

function shortenAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

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

async function apiPost<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
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

/** Register an agent on-chain, upsert in Convex, and log activity. */
export const registerAgent = action({
  args: { agent: v.string() },
  handler: async (ctx, { agent }): Promise<{ txHash: string; agent: string }> => {
    const result = await apiPost<{ txHash: string; agent: string }>(
      "/agents/register",
      { agent }
    );

    // Fetch the full agent data after registration
    let score = 0;
    try {
      const details = await apiGet<{ score: number }>(`/agents/${agent}`);
      score = details.score;
    } catch {
      // Agent may not have a score yet right after registration
    }

    await ctx.runMutation(api.mutations.agents.upsertAgent, {
      address: agent,
      score,
      isRegistered: true,
      addressShort: shortenAddress(agent),
      explorerUrl: `https://sepolia.basescan.org/address/${agent}`,
    });

    await ctx.runMutation(api.mutations.activity.logActivity, {
      agent,
      type: "Registration",
      description: `Agent ${shortenAddress(agent)} registered on-chain`,
      txHash: result.txHash,
    });

    return result;
  },
});

/** Update agent score on-chain, sync to Convex, snapshot + log. */
export const updateAgentScore = action({
  args: { address: v.string(), score: v.number() },
  handler: async (
    ctx,
    { address, score }
  ): Promise<{ txHash: string; agent: string; newScore: number }> => {
    const result = await apiPost<{
      txHash: string;
      agent: string;
      newScore: number;
    }>(`/agents/${address}/score`, { score });

    const grade = computeGrade(score);
    const gradeColor = computeGradeColor(score);

    await ctx.runMutation(api.mutations.agents.updateScore, {
      address,
      score,
    });

    await ctx.runMutation(api.mutations.scores.addSnapshot, {
      agent: address,
      score,
      grade,
      gradeColor,
    });

    await ctx.runMutation(api.mutations.activity.logActivity, {
      agent: address,
      type: "ScoreUpdate",
      description: `Score updated to ${score} (${grade})`,
      txHash: result.txHash,
    });

    return result;
  },
});

/** Record a transaction on-chain and log in Convex. */
export const recordTransaction = action({
  args: {
    agent: v.string(),
    txHash: v.string(),
    amount: v.string(),
    txType: v.number(),
  },
  handler: async (
    ctx,
    { agent, txHash, amount, txType }
  ): Promise<{ txHash: string; agent: string }> => {
    const txTypeNames = ["Payment", "Transfer", "Swap", "Stake", "Other"];
    const typeName = txTypeNames[txType] ?? "Other";

    const result = await apiPost<{ txHash: string; agent: string }>(
      "/transactions/record",
      { agent, txHash, amount, txType }
    );

    await ctx.runMutation(api.mutations.activity.logActivity, {
      agent,
      type: typeName,
      description: `${typeName} of ${amount}`,
      amount,
      txHash: result.txHash,
    });

    return result;
  },
});

/** Set budget limits for an agent on-chain and log in Convex. */
export const setBudget = action({
  args: {
    address: v.string(),
    dailyLimit: v.string(),
    monthlyLimit: v.string(),
    perTxLimit: v.string(),
  },
  handler: async (
    ctx,
    { address, dailyLimit, monthlyLimit, perTxLimit }
  ): Promise<{ txHash: string; agent: string }> => {
    const result = await apiPost<{ txHash: string; agent: string }>(
      `/budgets/${address}/set`,
      { dailyLimit, monthlyLimit, perTxLimit }
    );

    // Fetch current agent score so upsert doesn't overwrite it
    const existing = await ctx.runQuery(api.queries.agents.getByAddress, {
      address,
    });
    const currentScore = existing?.score ?? 0;

    // Update cached budget data in the agent document
    await ctx.runMutation(api.mutations.agents.upsertAgent, {
      address,
      score: currentScore,
      dailyLimit,
      monthlyLimit,
      perTxLimit,
    });

    await ctx.runMutation(api.mutations.activity.logActivity, {
      agent: address,
      type: "BudgetUpdate",
      description: `Budget set: daily=${dailyLimit}, monthly=${monthlyLimit}, perTx=${perTxLimit}`,
    });

    return result;
  },
});

/** Verify an agent's trust status and log the result. */
export const verifyAgent = action({
  args: { agent: v.string() },
  handler: async (
    ctx,
    { agent }
  ): Promise<{
    agent: string;
    verified: boolean;
    score: number;
    grade: string;
    sanctionsClean: boolean;
    isRegistered: boolean;
    timestamp: string;
  }> => {
    const result = await apiPost<{
      agent: string;
      verified: boolean;
      score: number;
      grade: string;
      sanctionsClean: boolean;
      isRegistered: boolean;
      timestamp: string;
    }>("/verify", { agent });

    await ctx.runMutation(api.mutations.activity.logActivity, {
      agent,
      type: "Verification",
      description: `Verification ${result.verified ? "passed" : "failed"} -- Grade: ${result.grade}, Sanctions: ${result.sanctionsClean ? "clean" : "flagged"}`,
    });

    return result;
  },
});
