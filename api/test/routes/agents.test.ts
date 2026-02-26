import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/chain", () => ({
	getQovaClient: () => ({
		getAgentDetails: vi.fn().mockResolvedValue({
			score: 850,
			lastUpdated: 1708900000n,
			updateCount: 12,
			isRegistered: true,
		}),
		getScore: vi.fn().mockResolvedValue(850),
		isAgentRegistered: vi.fn().mockResolvedValue(true),
		registerAgent: vi.fn().mockResolvedValue("0xabcdef1234567890"),
		updateScore: vi.fn().mockResolvedValue("0xabcdef1234567890"),
		batchUpdateScores: vi.fn().mockResolvedValue("0xabcdef1234567890"),
	}),
}));

const { app } = await import("../../src/app.js");

const VALID_ADDRESS = "0x0000000000000000000000000000000000000001";

describe("GET /api/agents/:address", () => {
	it("returns enriched agent details", async () => {
		const res = await app.request(`/api/agents/${VALID_ADDRESS}`);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.score).toBe(850);
		expect(body.grade).toBe("A");
		expect(body.gradeColor).toBe("#22C55E");
		expect(body.isRegistered).toBe(true);
		expect(body.scoreFormatted).toBe("0850");
		expect(body.scorePercentage).toBe(85);
		expect(body.addressShort).toContain("...");
	});

	it("returns 400 for invalid address", async () => {
		const res = await app.request("/api/agents/not-an-address");
		expect(res.status).toBe(400);
	});
});

describe("GET /api/agents/:address/score", () => {
	it("returns score with grade and color", async () => {
		const res = await app.request(
			`/api/agents/${VALID_ADDRESS}/score`,
		);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.score).toBe(850);
		expect(body.grade).toBe("A");
		expect(body.gradeColor).toMatch(/^#[A-Fa-f0-9]{6}$/);
	});
});

describe("GET /api/agents/:address/registered", () => {
	it("returns registration status", async () => {
		const res = await app.request(
			`/api/agents/${VALID_ADDRESS}/registered`,
		);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.isRegistered).toBe(true);
	});
});

describe("GET /api/agents", () => {
	it("returns agent list", async () => {
		const res = await app.request("/api/agents");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.agents).toBeInstanceOf(Array);
		expect(body.total).toBeGreaterThan(0);
	});
});

describe("POST /api/agents/register", () => {
	it("registers a new agent", async () => {
		const res = await app.request("/api/agents/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ agent: VALID_ADDRESS }),
		});
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.txHash).toBeDefined();
		expect(body.agent).toBe(VALID_ADDRESS);
	});

	it("returns 400 for invalid address in body", async () => {
		const res = await app.request("/api/agents/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ agent: "invalid" }),
		});
		expect(res.status).toBe(400);
	});
});
