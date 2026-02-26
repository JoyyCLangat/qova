/**
 * Qova API Server -- Hono on Bun
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { agentRoutes } from "./routes/agents.js";
import { reputationRoutes } from "./routes/reputation.js";

const app = new Hono();

// Global middleware
app.use("*", cors());
app.use("*", logger());

// Health check
app.get("/health", (c) => c.json({ status: "ok", service: "qova-api" }));

// Routes
app.route("/agents", agentRoutes);
app.route("/reputation", reputationRoutes);

// 404 handler
app.notFound((c) => c.json({ error: "Not Found", code: "NOT_FOUND" }, 404));

// Error handler
app.onError((error, c) => {
  console.error("Unhandled error:", error);
  return c.json({ error: "Internal Server Error", code: "INTERNAL_ERROR" }, 500);
});

export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};

export { app };
