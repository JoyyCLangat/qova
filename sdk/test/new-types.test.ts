import { describe, expect, it } from "vitest";
import {
  AgentDetailsSchema,
  AgentScoreSchema,
  TransactionStatsSchema,
  TransactionTypeSchema,
  BudgetConfigSchema,
  BudgetStatusSchema,
  QovaClientConfigSchema,
  ContractAddressesSchema,
} from "../src/types/index.js";
import { TransactionType, TRANSACTION_TYPE_LABELS } from "../src/types/transaction.js";

describe("AgentDetailsSchema", () => {
  it("should validate valid agent details", () => {
    const result = AgentDetailsSchema.safeParse({
      score: 850,
      lastUpdated: 1709000000n,
      updateCount: 5,
      isRegistered: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject score above 1000", () => {
    const result = AgentDetailsSchema.safeParse({
      score: 1001,
      lastUpdated: 1709000000n,
      updateCount: 5,
      isRegistered: true,
    });
    expect(result.success).toBe(false);
  });

  it("should reject score below 0", () => {
    const result = AgentDetailsSchema.safeParse({
      score: -1,
      lastUpdated: 1709000000n,
      updateCount: 0,
      isRegistered: true,
    });
    expect(result.success).toBe(false);
  });

  it("should accept score 0 (edge case)", () => {
    const result = AgentDetailsSchema.safeParse({
      score: 0,
      lastUpdated: 0n,
      updateCount: 0,
      isRegistered: false,
    });
    expect(result.success).toBe(true);
  });

  it("should accept score 1000 (edge case)", () => {
    const result = AgentDetailsSchema.safeParse({
      score: 1000,
      lastUpdated: 1709000000n,
      updateCount: 100,
      isRegistered: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("AgentScoreSchema", () => {
  it("should validate valid agent score", () => {
    const result = AgentScoreSchema.safeParse({
      agent: "0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158",
      score: 850,
      grade: "A",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid address", () => {
    const result = AgentScoreSchema.safeParse({
      agent: "not-an-address",
      score: 850,
      grade: "A",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid grade", () => {
    const result = AgentScoreSchema.safeParse({
      agent: "0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158",
      score: 850,
      grade: "AAAA",
    });
    expect(result.success).toBe(false);
  });
});

describe("TransactionType", () => {
  it("should have correct enum values matching Solidity", () => {
    expect(TransactionType.PAYMENT).toBe(0);
    expect(TransactionType.SWAP).toBe(1);
    expect(TransactionType.TRANSFER).toBe(2);
    expect(TransactionType.CONTRACT_CALL).toBe(3);
    expect(TransactionType.BRIDGE).toBe(4);
  });

  it("should have labels for all types", () => {
    expect(TRANSACTION_TYPE_LABELS[TransactionType.PAYMENT]).toBe("Payment");
    expect(TRANSACTION_TYPE_LABELS[TransactionType.SWAP]).toBe("Swap");
    expect(TRANSACTION_TYPE_LABELS[TransactionType.TRANSFER]).toBe("Transfer");
    expect(TRANSACTION_TYPE_LABELS[TransactionType.CONTRACT_CALL]).toBe("Contract Call");
    expect(TRANSACTION_TYPE_LABELS[TransactionType.BRIDGE]).toBe("Bridge");
  });
});

describe("TransactionTypeSchema", () => {
  it("should accept valid values 0-4", () => {
    for (let i = 0; i <= 4; i++) {
      expect(TransactionTypeSchema.safeParse(i).success).toBe(true);
    }
  });

  it("should reject invalid values", () => {
    expect(TransactionTypeSchema.safeParse(5).success).toBe(false);
    expect(TransactionTypeSchema.safeParse(-1).success).toBe(false);
    expect(TransactionTypeSchema.safeParse("PAYMENT").success).toBe(false);
  });
});

describe("TransactionStatsSchema", () => {
  it("should validate valid stats", () => {
    const result = TransactionStatsSchema.safeParse({
      totalCount: 100,
      totalVolume: 50000000n,
      successCount: 95,
      lastActivityTimestamp: 1709000000n,
    });
    expect(result.success).toBe(true);
  });
});

describe("BudgetConfigSchema", () => {
  it("should validate valid budget config", () => {
    const result = BudgetConfigSchema.safeParse({
      dailyLimit: 1000000000000000000n,
      monthlyLimit: 30000000000000000000n,
      perTxLimit: 100000000000000000n,
    });
    expect(result.success).toBe(true);
  });
});

describe("BudgetStatusSchema", () => {
  it("should validate valid budget status", () => {
    const result = BudgetStatusSchema.safeParse({
      dailyRemaining: 500000000000000000n,
      monthlyRemaining: 25000000000000000000n,
      perTxLimit: 100000000000000000n,
      dailySpent: 500000000000000000n,
      monthlySpent: 5000000000000000000n,
    });
    expect(result.success).toBe(true);
  });
});

describe("ContractAddressesSchema", () => {
  it("should validate valid contract addresses", () => {
    const result = ContractAddressesSchema.safeParse({
      ReputationRegistry: "0x0b2466b01E6d73A24D9C716A9072ED3923563fBB",
      TransactionValidator: "0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900",
      BudgetEnforcer: "0x271618781040dc358e4F6B66561b65A839b0C76E",
      QovaCore: "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid addresses", () => {
    const result = ContractAddressesSchema.safeParse({
      ReputationRegistry: "not-an-address",
      TransactionValidator: "0x123",
      BudgetEnforcer: "0x271618781040dc358e4F6B66561b65A839b0C76E",
      QovaCore: "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a",
    });
    expect(result.success).toBe(false);
  });
});

describe("QovaClientConfigSchema", () => {
  it("should validate minimal config", () => {
    const result = QovaClientConfigSchema.safeParse({
      chain: "base-sepolia",
    });
    expect(result.success).toBe(true);
  });

  it("should validate config with rpcUrl", () => {
    const result = QovaClientConfigSchema.safeParse({
      chain: "base-sepolia",
      rpcUrl: "https://sepolia.base.org",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid chain", () => {
    const result = QovaClientConfigSchema.safeParse({
      chain: "ethereum",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid rpcUrl", () => {
    const result = QovaClientConfigSchema.safeParse({
      chain: "base-sepolia",
      rpcUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
