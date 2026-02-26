/**
 * Pre-Transaction Trust Check Workflow
 * Evaluates agent trustworthiness before x402 payment processing.
 * Triggered by HTTP webhook from payment facilitator.
 * @author Qova Engineering <eng@qova.cc>
 */

export interface TrustCheckInput {
  agentId: string;
  amount: string;
  token: string;
  counterpartyId: string;
}

export interface TrustCheckOutput {
  approved: boolean;
  score: number;
  reason: string;
  maxApprovedAmount?: string;
}

/**
 * Placeholder for CRE workflow definition.
 * Will be implemented when @chainlink/cre-sdk is available.
 */
export const trustCheckWorkflow = {
  name: "qova-trust-check",
  version: "0.1.0",
  triggers: ["http:POST /trust/check"],
  description: "Pre-transaction trust verification for x402 payments",
};
