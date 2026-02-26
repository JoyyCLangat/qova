/**
 * Type barrel exports.
 * @author Qova Engineering <eng@qova.cc>
 */

export type { AgentDetails, AgentScore, ScoreGrade } from "./agent.js";
export { AgentDetailsSchema, AgentScoreSchema, SCORE_GRADES } from "./agent.js";
export type { BudgetConfig, BudgetStatus } from "./budget.js";
export { BudgetConfigSchema, BudgetStatusSchema } from "./budget.js";
export type { Chain, ContractAddresses, QovaClientConfig } from "./config.js";
export { ChainSchema, ContractAddressesSchema, QovaClientConfigSchema } from "./config.js";
export {
	AgentAlreadyRegisteredError,
	AgentNotRegisteredError,
	ArrayLengthMismatchError,
	BudgetExceededError,
	InvalidScoreError,
	mapContractError,
	NoBudgetSetError,
	QovaError,
	UnauthorizedError,
	ZeroAddressError,
} from "./errors.js";
export type {
	AgentActionExecutedEvent,
	AgentRegisteredEvent,
	BudgetSetEvent,
	QovaEvent,
	ScoreUpdatedEvent,
	SpendRecordedEvent,
	TransactionRecordedEvent,
	WatchConfig,
} from "./events.js";
export type { TransactionStats, TransactionType } from "./transaction.js";
export {
	TRANSACTION_TYPE_LABELS,
	TransactionStatsSchema,
	TransactionType as TransactionTypeEnum,
	TransactionTypeSchema,
} from "./transaction.js";
