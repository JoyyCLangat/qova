/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_chain from "../actions/chain.js";
import type * as actions_sync from "../actions/sync.js";
import type * as mutations_activity from "../mutations/activity.js";
import type * as mutations_agents from "../mutations/agents.js";
import type * as mutations_scores from "../mutations/scores.js";
import type * as mutations_seed from "../mutations/seed.js";
import type * as mutations_stats from "../mutations/stats.js";
import type * as queries_activity from "../queries/activity.js";
import type * as queries_agents from "../queries/agents.js";
import type * as queries_scores from "../queries/scores.js";
import type * as queries_stats from "../queries/stats.js";

declare const fullApi: ApiFromModules<{
  "actions/chain": typeof actions_chain;
  "actions/sync": typeof actions_sync;
  "mutations/activity": typeof mutations_activity;
  "mutations/agents": typeof mutations_agents;
  "mutations/scores": typeof mutations_scores;
  "mutations/seed": typeof mutations_seed;
  "mutations/stats": typeof mutations_stats;
  "queries/activity": typeof queries_activity;
  "queries/agents": typeof queries_agents;
  "queries/scores": typeof queries_scores;
  "queries/stats": typeof queries_stats;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
