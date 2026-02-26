import { describe, expect, it } from "bun:test";
import { encodeFunctionData } from "viem";
import {
	BUDGET_ENFORCER_ABI,
	REPUTATION_REGISTRY_ABI,
	TRANSACTION_VALIDATOR_ABI,
} from "../shared/contracts";

describe("Contract ABI encoding", () => {
	it("encodes getScore call data", () => {
		const data = encodeFunctionData({
			abi: REPUTATION_REGISTRY_ABI,
			functionName: "getScore",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
		expect(data.startsWith("0x")).toBe(true);
	});

	it("encodes getAgentDetails call data", () => {
		const data = encodeFunctionData({
			abi: REPUTATION_REGISTRY_ABI,
			functionName: "getAgentDetails",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});

	it("encodes isRegistered call data", () => {
		const data = encodeFunctionData({
			abi: REPUTATION_REGISTRY_ABI,
			functionName: "isRegistered",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});

	it("encodes updateScore call data", () => {
		const data = encodeFunctionData({
			abi: REPUTATION_REGISTRY_ABI,
			functionName: "updateScore",
			args: [
				"0x0000000000000000000000000000000000000001",
				750,
				"0x0000000000000000000000000000000000000000000000000000000000000000",
			],
		});
		expect(data).toBeTruthy();
	});

	it("encodes getTransactionStats call data", () => {
		const data = encodeFunctionData({
			abi: TRANSACTION_VALIDATOR_ABI,
			functionName: "getTransactionStats",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});

	it("encodes getSuccessRate call data", () => {
		const data = encodeFunctionData({
			abi: TRANSACTION_VALIDATOR_ABI,
			functionName: "getSuccessRate",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});

	it("encodes getBudgetStatus call data", () => {
		const data = encodeFunctionData({
			abi: BUDGET_ENFORCER_ABI,
			functionName: "getBudgetStatus",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});

	it("encodes hasBudget call data", () => {
		const data = encodeFunctionData({
			abi: BUDGET_ENFORCER_ABI,
			functionName: "hasBudget",
			args: ["0x0000000000000000000000000000000000000001"],
		});
		expect(data).toBeTruthy();
	});
});
