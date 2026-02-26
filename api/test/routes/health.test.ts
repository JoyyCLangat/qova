import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/chain", () => ({
	getQovaClient: () => ({
		publicClient: {
			getCode: vi.fn().mockResolvedValue("0x6080"),
		},
	}),
}));

const { app } = await import("../../src/app.js");

describe("GET /api/health", () => {
	it("returns health status with contract info", async () => {
		const res = await app.request("/api/health");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.status).toBe("ok");
		expect(body.chain).toBe("base-sepolia");
		expect(body.chainId).toBe(84532);
		expect(body.contracts).toBeDefined();
		expect(body.sdk.version).toBe("0.1.0");
		expect(body.api.version).toBe("0.1.0");
	});
});

describe("GET /", () => {
	it("returns API info", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.name).toBe("Qova Protocol API");
		expect(body.version).toBe("0.1.0");
	});
});
