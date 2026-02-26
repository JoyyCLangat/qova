/**
 * Reputation Scoring Workflow
 * Computes agent reputation scores from transaction data.
 * Triggered by cron (hourly) and HTTP webhook.
 * @author Qova Engineering <eng@qova.cc>
 */

// CRE SDK imports will be added when @chainlink/cre-sdk is available
// import { Workflow, CronCapability, HTTPClient, EVMClient } from "@chainlink/cre-sdk";

export interface ReputationInput {
  agentId: string;
  contractAddress: string;
  chainId: number;
}

export interface ReputationOutput {
  agentId: string;
  score: number;
  confidence: number;
  transactionCount: number;
  timestamp: number;
}

/**
 * Placeholder for CRE workflow definition.
 * Will be implemented when @chainlink/cre-sdk is available.
 */
export const reputationWorkflow = {
  name: "qova-reputation-scoring",
  version: "0.1.0",
  triggers: ["cron:0 * * * *", "http:POST /reputation/compute"],
  description: "Computes agent reputation scores from on-chain transaction data",
};
