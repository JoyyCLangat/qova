import type { FetchConfig } from "./fetch.js";
import { request } from "./fetch.js";
import type { BudgetStatusResponse, CheckBudgetResponse, SetBudgetInput, TxHashResponse } from "./types.js";

export class Budgets {
  constructor(private readonly config: FetchConfig) {}
  async get(address: string): Promise<BudgetStatusResponse> { return request(this.config, { method: "GET", path: "/api/budgets/" + address }); }
  async set(address: string, input: SetBudgetInput): Promise<TxHashResponse> { return request(this.config, { method: "POST", path: "/api/budgets/" + address + "/set", body: input }); }
  async check(address: string, amount: string): Promise<CheckBudgetResponse> { return request(this.config, { method: "POST", path: "/api/budgets/" + address + "/check", body: { amount } }); }
  async recordSpend(address: string, amount: string): Promise<TxHashResponse> { return request(this.config, { method: "POST", path: "/api/budgets/" + address + "/spend", body: { amount } }); }
}
