import { describe, expect, it } from "vitest";
import { ok, err, AgentIdentitySchema, ReputationScoreSchema } from "../src/types.js";

describe("Result pattern", () => {
  it("should create ok result", () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it("should create err result", () => {
    const result = err(new Error("fail"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("fail");
    }
  });
});

describe("AgentIdentitySchema", () => {
  it("should validate valid identity", () => {
    const result = AgentIdentitySchema.safeParse({
      agentId: "agent-1",
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      name: "TestAgent",
      createdAt: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid address", () => {
    const result = AgentIdentitySchema.safeParse({
      agentId: "agent-1",
      owner: "not-an-address",
      name: "TestAgent",
      createdAt: Date.now(),
    });
    expect(result.success).toBe(false);
  });
});

describe("ReputationScoreSchema", () => {
  it("should reject score above 1000", () => {
    const result = ReputationScoreSchema.safeParse({
      agentId: "agent-1",
      score: 1001,
      confidence: 50,
      totalTransactions: 10,
      successRate: 90,
      lastUpdated: Date.now(),
    });
    expect(result.success).toBe(false);
  });
});
