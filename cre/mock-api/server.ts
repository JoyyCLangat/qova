/**
 * @file mock-api/server.ts
 * Mock Qova Scoring API for CRE workflow simulation.
 * Run with: bun run cre/mock-api/server.ts
 */

const MOCK_AGENTS = [
	"0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158",
	"0x0000000000000000000000000000000000000001",
	"0x0000000000000000000000000000000000000002",
];

const server = Bun.serve({
	port: 3001,
	fetch(req: Request): Response {
		const url = new URL(req.url);

		// GET /v1/agents -- registered agent addresses
		if (url.pathname === "/v1/agents" && req.method === "GET") {
			return Response.json({ agents: MOCK_AGENTS });
		}

		// POST /v1/enrich -- off-chain enrichment data
		if (url.pathname === "/v1/enrich" && req.method === "POST") {
			return Response.json({
				sanctionsClean: true,
				apiReputationScore: 82,
				riskLevel: "LOW",
				lastChecked: Date.now(),
			});
		}

		// POST /v1/anomaly-check -- anomaly detection
		if (url.pathname === "/v1/anomaly-check" && req.method === "POST") {
			return Response.json({
				anomalyDetected: false,
				riskScore: 0.12,
				flags: [],
			});
		}

		// POST /v1/sanctions/check -- sanctions screening
		if (url.pathname === "/v1/sanctions/check" && req.method === "POST") {
			return Response.json({
				clean: true,
				checked: true,
				source: "mock-ofac-sdn",
				timestamp: Date.now(),
			});
		}

		// POST /v1/webhook -- alert webhook sink
		if (url.pathname === "/v1/webhook" && req.method === "POST") {
			console.log(`[WEBHOOK] Alert received at ${new Date().toISOString()}`);
			return Response.json({ received: true });
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log(`Mock Qova API running on http://localhost:${server.port}`);
