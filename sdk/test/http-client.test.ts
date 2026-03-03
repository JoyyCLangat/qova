/**
 * Tests for the Qova HTTP SDK.
 */

import { describe, expect, it, vi, afterEach } from "vitest";
import { Qova } from "../src/http/client.js";
import { QovaConfigError, QovaApiError, QovaAuthError, QovaNetworkError } from "../src/http/errors.js";

describe("Qova constructor", () => {
	it("throws QovaConfigError without API key", () => {
		expect(() => new Qova("")).toThrow(QovaConfigError);
	});

	it("throws QovaConfigError for invalid key format", () => {
		expect(() => new Qova("sk_live_abc123")).toThrow(QovaConfigError);
	});

	it("creates client with valid key", () => {
		const qova = new Qova("qova_test_abc123def456");
		expect(qova).toBeInstanceOf(Qova);
		expect(qova.agents).toBeDefined();
		expect(qova.scores).toBeDefined();
		expect(qova.transactions).toBeDefined();
		expect(qova.budgets).toBeDefined();
		expect(qova.keys).toBeDefined();
	});

	it("accepts custom options", () => {
		const qova = new Qova("qova_test_abc123def456", {
			baseUrl: "http://localhost:3000",
			timeout: 5000,
			maxRetries: 0,
			retryDelay: 500,
			headers: { "X-Custom": "value" },
		});
		expect(qova).toBeInstanceOf(Qova);
	});
});

describe("Resources", () => {
	const qova = new Qova("qova_test_abc123def456");

	it("agents has expected methods", () => {
		expect(typeof qova.agents.list).toBe("function");
		expect(typeof qova.agents.get).toBe("function");
		expect(typeof qova.agents.score).toBe("function");
		expect(typeof qova.agents.isRegistered).toBe("function");
		expect(typeof qova.agents.register).toBe("function");
		expect(typeof qova.agents.updateScore).toBe("function");
		expect(typeof qova.agents.batchUpdateScores).toBe("function");
	});

	it("scores has expected methods", () => {
		expect(typeof qova.scores.breakdown).toBe("function");
		expect(typeof qova.scores.compute).toBe("function");
		expect(typeof qova.scores.enrich).toBe("function");
		expect(typeof qova.scores.anomalyCheck).toBe("function");
	});

	it("budgets has expected methods", () => {
		expect(typeof qova.budgets.get).toBe("function");
		expect(typeof qova.budgets.set).toBe("function");
		expect(typeof qova.budgets.check).toBe("function");
		expect(typeof qova.budgets.recordSpend).toBe("function");
	});

	it("top-level verify and health exist", () => {
		expect(typeof qova.verify).toBe("function");
		expect(typeof qova.sanctionsCheck).toBe("function");
		expect(typeof qova.health).toBe("function");
	});
});

describe("HTTP requests", () => {
	const originalFetch = globalThis.fetch;
	afterEach(() => { globalThis.fetch = originalFetch; });

	function mockFetch(status: number, body: unknown) {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: status >= 200 && status < 300,
			status,
			headers: new Headers(),
			json: async () => body,
			text: async () => JSON.stringify(body),
		});
	}

	it("sends correct auth header", async () => {
		mockFetch(200, { agents: [], total: 0 });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await qova.agents.list();
		const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
		expect((options.headers as Record<string, string>)["Authorization"]).toBe("Bearer qova_test_mykey123456");
	});

	it("sends User-Agent header", async () => {
		mockFetch(200, { agents: [], total: 0 });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await qova.agents.list();
		const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
		expect((options.headers as Record<string, string>)["User-Agent"]).toMatch(/^@qova\/core\//);
	});

	it("parses JSON response", async () => {
		mockFetch(200, { agent: "0xabc", score: 750, grade: "A" });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		const result = await qova.agents.score("0xabc");
		expect(result).toEqual({ agent: "0xabc", score: 750, grade: "A" });
	});

	it("throws QovaAuthError on 401", async () => {
		mockFetch(401, { error: "Invalid API key" });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await expect(qova.agents.list()).rejects.toThrow(QovaAuthError);
	});

	it("throws QovaAuthError on 403", async () => {
		mockFetch(403, { error: "Insufficient scope" });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await expect(qova.agents.list()).rejects.toThrow(QovaAuthError);
	});

	it("throws QovaApiError on 400 with code", async () => {
		mockFetch(400, { error: "Invalid address", code: "INVALID_ADDRESS" });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		try {
			await qova.agents.score("bad");
			expect.unreachable("Should throw");
		} catch (e) {
			expect(e).toBeInstanceOf(QovaApiError);
			expect((e as QovaApiError).status).toBe(400);
			expect((e as QovaApiError).code).toBe("INVALID_ADDRESS");
		}
	});

	it("throws QovaNetworkError on fetch failure", async () => {
		globalThis.fetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await expect(qova.health()).rejects.toThrow(QovaNetworkError);
	});

	it("sends POST body as JSON", async () => {
		mockFetch(200, { txHash: "0x123", agent: "0xabc" });
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 0 });
		await qova.agents.register("0xabc");
		const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(options.method).toBe("POST");
		expect(JSON.parse(options.body as string)).toEqual({ agent: "0xabc" });
	});

	it("retries on 500", async () => {
		let calls = 0;
		globalThis.fetch = vi.fn().mockImplementation(async () => {
			calls++;
			if (calls === 1) return { ok: false, status: 500, headers: new Headers(), json: async () => ({}) };
			return { ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify({ status: "ok" }) };
		});
		const qova = new Qova("qova_test_mykey123456", { baseUrl: "http://localhost:3000", maxRetries: 2, retryDelay: 10 });
		const result = await qova.health();
		expect(result.status).toBe("ok");
		expect(calls).toBe(2);
	});
});

describe("Error classes", () => {
	it("QovaApiError has status and code", () => {
		const err = new QovaApiError("bad request", 400, "BAD_REQUEST", { detail: "x" });
		expect(err.name).toBe("QovaApiError");
		expect(err.status).toBe(400);
		expect(err.code).toBe("BAD_REQUEST");
		expect(err.body).toEqual({ detail: "x" });
	});

	it("QovaAuthError defaults to 401", () => {
		const err = new QovaAuthError("no key");
		expect(err.status).toBe(401);
	});

	it("QovaNetworkError includes cause", () => {
		const cause = new Error("ECONNREFUSED");
		const err = new QovaNetworkError("fail", cause);
		expect(err.cause).toBe(cause);
	});

	it("QovaConfigError is Error", () => {
		const err = new QovaConfigError("missing");
		expect(err).toBeInstanceOf(Error);
		expect(err.name).toBe("QovaConfigError");
	});
});
