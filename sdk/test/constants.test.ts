import { describe, expect, it } from "vitest";
import {
  CHAIN_IDS,
  CONTRACTS,
  DEFAULT_CHAIN_ID,
  getContracts,
  BLOCK_EXPLORERS,
  DEFAULT_RPC_URLS,
  MIN_SCORE,
  MAX_SCORE,
  SCORE_GRADE_THRESHOLDS,
} from "../src/constants.js";

describe("constants", () => {
  it("should have correct chain IDs", () => {
    expect(CHAIN_IDS.BASE_SEPOLIA).toBe(84532);
    expect(CHAIN_IDS.BASE_MAINNET).toBe(8453);
  });

  it("should default to Base Sepolia", () => {
    expect(DEFAULT_CHAIN_ID).toBe(84532);
  });

  it("should have Base Sepolia contract addresses", () => {
    const contracts = CONTRACTS[CHAIN_IDS.BASE_SEPOLIA];
    expect(contracts).toBeDefined();
    expect(contracts!.ReputationRegistry).toMatch(/^0x/);
    expect(contracts!.TransactionValidator).toMatch(/^0x/);
    expect(contracts!.BudgetEnforcer).toMatch(/^0x/);
    expect(contracts!.QovaCore).toMatch(/^0x/);
  });

  it("should have block explorer URLs", () => {
    expect(BLOCK_EXPLORERS[CHAIN_IDS.BASE_SEPOLIA]).toContain("sepolia.basescan.org");
    expect(BLOCK_EXPLORERS[CHAIN_IDS.BASE_MAINNET]).toContain("basescan.org");
  });

  it("should have default RPC URLs", () => {
    expect(DEFAULT_RPC_URLS[CHAIN_IDS.BASE_SEPOLIA]).toContain("sepolia.base.org");
    expect(DEFAULT_RPC_URLS[CHAIN_IDS.BASE_MAINNET]).toContain("mainnet.base.org");
  });

  it("should have correct score bounds", () => {
    expect(MIN_SCORE).toBe(0);
    expect(MAX_SCORE).toBe(1000);
  });

  it("should have score grade thresholds in descending order", () => {
    expect(SCORE_GRADE_THRESHOLDS.AAA).toBe(950);
    expect(SCORE_GRADE_THRESHOLDS.AA).toBe(900);
    expect(SCORE_GRADE_THRESHOLDS.A).toBe(850);
    expect(SCORE_GRADE_THRESHOLDS.BBB).toBe(750);
    expect(SCORE_GRADE_THRESHOLDS.BB).toBe(650);
    expect(SCORE_GRADE_THRESHOLDS.B).toBe(550);
    expect(SCORE_GRADE_THRESHOLDS.CCC).toBe(450);
    expect(SCORE_GRADE_THRESHOLDS.CC).toBe(350);
    expect(SCORE_GRADE_THRESHOLDS.C).toBe(250);
    expect(SCORE_GRADE_THRESHOLDS.D).toBe(0);
  });
});

describe("getContracts", () => {
  it("should return contracts for Base Sepolia", () => {
    const contracts = getContracts(84532);
    expect(contracts.ReputationRegistry).toBeDefined();
    expect(contracts.QovaCore).toBeDefined();
  });

  it("should throw for unknown chain", () => {
    expect(() => getContracts(999)).toThrow("No contracts deployed on chain 999");
  });
});
