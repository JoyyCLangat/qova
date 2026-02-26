import { describe, expect, it } from "vitest";
import { createQovaClient } from "../src/client.js";
import { QovaError } from "../src/types/errors.js";
import type { Address } from "viem";

describe("createQovaClient", () => {
  it("should create client with valid minimal config", () => {
    const client = createQovaClient({ chain: "base-sepolia" });
    expect(client).toBeDefined();
    expect(client.publicClient).toBeDefined();
    expect(client.walletClient).toBeUndefined();
    expect(client.contracts).toBeDefined();
  });

  it("should default to Base Sepolia deployed addresses", () => {
    const client = createQovaClient({ chain: "base-sepolia" });
    expect(client.contracts.ReputationRegistry).toBe(
      "0x0b2466b01E6d73A24D9C716A9072ED3923563fBB",
    );
    expect(client.contracts.TransactionValidator).toBe(
      "0x5d7a7AEAb26D2F0076892D1C9A28F230EbB3e900",
    );
    expect(client.contracts.BudgetEnforcer).toBe(
      "0x271618781040dc358e4F6B66561b65A839b0C76E",
    );
    expect(client.contracts.QovaCore).toBe(
      "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a",
    );
  });

  it("should accept custom contract addresses", () => {
    const custom: Address = "0x1111111111111111111111111111111111111111";
    const client = createQovaClient({
      chain: "base-sepolia",
      contracts: { ReputationRegistry: custom },
    });
    expect(client.contracts.ReputationRegistry).toBe(custom);
    // Others should still default
    expect(client.contracts.QovaCore).toBe(
      "0x9Ee4ae0bD93E95498fB6AB444ae6205d56fEf76a",
    );
  });

  it("should accept custom rpcUrl", () => {
    const client = createQovaClient({
      chain: "base-sepolia",
      rpcUrl: "https://custom-rpc.example.com",
    });
    expect(client).toBeDefined();
  });

  it("should throw QovaError for invalid chain", () => {
    expect(() =>
      createQovaClient({ chain: "ethereum" as "base-sepolia" }),
    ).toThrow(QovaError);
  });

  it("should throw QovaError for invalid rpcUrl", () => {
    expect(() =>
      createQovaClient({
        chain: "base-sepolia",
        rpcUrl: "not-a-url",
      }),
    ).toThrow(QovaError);
  });

  it("should throw on write operations without walletClient", () => {
    const client = createQovaClient({ chain: "base-sepolia" });
    const addr: Address = "0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158";
    const hash = "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

    expect(() => client.registerAgent(addr)).toThrow("walletClient is required");
    expect(() => client.updateScore(addr, 500, hash)).toThrow("walletClient is required");
    expect(() => client.setBudget(addr, 100n, 1000n, 10n)).toThrow("walletClient is required");
    expect(() => client.executeAgentAction(addr, hash, 100n, 0)).toThrow("walletClient is required");
  });

  it("should expose all expected methods", () => {
    const client = createQovaClient({ chain: "base-sepolia" });

    // Read methods
    expect(typeof client.getScore).toBe("function");
    expect(typeof client.getAgentDetails).toBe("function");
    expect(typeof client.isAgentRegistered).toBe("function");
    expect(typeof client.getTransactionStats).toBe("function");
    expect(typeof client.checkBudget).toBe("function");
    expect(typeof client.getBudgetStatus).toBe("function");

    // Write methods
    expect(typeof client.registerAgent).toBe("function");
    expect(typeof client.updateScore).toBe("function");
    expect(typeof client.batchUpdateScores).toBe("function");
    expect(typeof client.recordTransaction).toBe("function");
    expect(typeof client.setBudget).toBe("function");
    expect(typeof client.recordSpend).toBe("function");
    expect(typeof client.executeAgentAction).toBe("function");
  });
});
