/**
 * Hono app configuration -- middleware stack + route mounting.
 * @author Qova Engineering <eng@qova.cc>
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { errorHandler } from "./middleware/error.js";
import { routes } from "./routes/index.js";

const app = new Hono();

// Middleware
app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5173",
			"https://qova.cc",
			"https://qova-dashboard.vercel.app",
		],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);
app.use("*", logger());
app.use("*", prettyJSON());
app.onError(errorHandler);

// Mount API routes under /api
app.route("/api", routes);

// CRE-compatible routes under /v1 (backward compat with CRE workflow configs)
app.get("/v1/agents", (c) => {
	return c.json({
		agents: [
			"0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158",
			"0x0000000000000000000000000000000000000001",
			"0x0000000000000000000000000000000000000002",
		],
	});
});
app.post("/v1/enrich", async (c) => {
	return c.json({
		sanctionsClean: true,
		apiReputationScore: 82,
		riskLevel: "LOW",
		lastChecked: Date.now(),
	});
});
app.post("/v1/anomaly-check", async (c) => {
	return c.json({
		anomalyDetected: false,
		riskScore: 0.12,
		flags: [],
	});
});
app.post("/v1/sanctions/check", async (c) => {
	return c.json({
		clean: true,
		checked: true,
		source: "mock-ofac-sdn",
		timestamp: Date.now(),
	});
});
app.post("/v1/webhook", async (c) => {
	console.log(`[WEBHOOK] Alert received at ${new Date().toISOString()}`);
	return c.json({ received: true });
});

// Root -- API info
app.get("/", (c) =>
	c.json({
		name: "Qova Protocol API",
		version: "0.1.0",
		chain: "base-sepolia",
		docs: "/api/health",
	}),
);

// 404 handler
app.notFound((c) => c.json({ error: "Not Found", code: "NOT_FOUND" }, 404));

export { app };
