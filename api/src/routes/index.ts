/**
 * Route aggregator -- mounts all API routes.
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import { apiKeyAuth, API_SCOPES } from "../middleware/auth.js";
import { agentRoutes } from "./agents.js";
import { budgetRoutes } from "./budgets.js";
import { docsRoutes } from "./docs.js";
import { healthRoutes } from "./health.js";
import { apiKeyRoutes } from "./keys.js";
import { scoreRoutes } from "./scores.js";
import { transactionRoutes } from "./transactions.js";
import { verifyRoutes } from "./verify.js";

const routes = new Hono();

// Public routes (no auth required)
routes.route("/health", healthRoutes);
routes.route("/docs", docsRoutes);

// Protected routes (API key required)
routes.use("/agents/*", apiKeyAuth({ scope: API_SCOPES.AGENTS_READ }));
routes.use("/scores/*", apiKeyAuth({ scope: API_SCOPES.SCORES_READ }));
routes.use("/transactions/*", apiKeyAuth({ scope: API_SCOPES.TRANSACTIONS_READ }));
routes.use("/budgets/*", apiKeyAuth({ scope: API_SCOPES.AGENTS_READ }));
routes.use("/verify/*", apiKeyAuth({ scope: API_SCOPES.AGENTS_READ }));

routes.route("/agents", agentRoutes);
routes.route("/transactions", transactionRoutes);
routes.route("/budgets", budgetRoutes);
routes.route("/scores", scoreRoutes);
routes.route("/verify", verifyRoutes);
routes.route("/keys", apiKeyRoutes);

export { routes };
