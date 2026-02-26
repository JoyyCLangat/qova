/**
 * Route aggregator -- mounts all API routes.
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import { agentRoutes } from "./agents.js";
import { budgetRoutes } from "./budgets.js";
import { healthRoutes } from "./health.js";
import { scoreRoutes } from "./scores.js";
import { transactionRoutes } from "./transactions.js";
import { verifyRoutes } from "./verify.js";

const routes = new Hono();

routes.route("/agents", agentRoutes);
routes.route("/transactions", transactionRoutes);
routes.route("/budgets", budgetRoutes);
routes.route("/scores", scoreRoutes);
routes.route("/verify", verifyRoutes);
routes.route("/health", healthRoutes);

export { routes };
