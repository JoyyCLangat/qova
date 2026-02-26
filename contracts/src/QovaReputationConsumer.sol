// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReputationRegistry} from "./ReputationRegistry.sol";

/// @title QovaReputationConsumer
/// @author Qova Engineering
/// @notice Receives CRE workflow reports and writes reputation scores on-chain.
/// @dev Deployed as the CRE report receiver. The CRE DON calls `onReport` which
///      decodes the payload and forwards the score update to ReputationRegistry.
///      Only addresses with CRE_FORWARDER_ROLE can call `onReport`.
contract QovaReputationConsumer is AccessControl {
    // ──────────────────────────────────────────────
    //  Roles
    // ──────────────────────────────────────────────

    /// @notice Role granted to the CRE forwarder contract.
    bytes32 public constant CRE_FORWARDER_ROLE = keccak256("CRE_FORWARDER_ROLE");

    // ──────────────────────────────────────────────
    //  State
    // ──────────────────────────────────────────────

    /// @notice The Qova ReputationRegistry that stores agent scores.
    ReputationRegistry public reputationRegistry;

    /// @notice Tracks the last report timestamp per agent for replay protection.
    mapping(address => uint48) public lastReportTimestamp;

    // ──────────────────────────────────────────────
    //  Errors
    // ──────────────────────────────────────────────

    /// @dev Thrown when the registry address is zero.
    error InvalidRegistry();

    /// @dev Thrown when report payload decoding fails.
    error InvalidReportPayload();

    /// @dev Thrown when a stale or replayed report is submitted.
    error StaleReport();

    /// @dev Thrown when the score exceeds the valid range.
    error ScoreOutOfRange();

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    /// @notice Emitted when a CRE reputation report is processed.
    /// @param agent     The agent whose score was updated.
    /// @param newScore  The new reputation score.
    /// @param reason    CRE workflow identifier hash.
    /// @param timestamp Block timestamp of the report.
    event ReputationReportProcessed(
        address indexed agent,
        uint16 newScore,
        bytes32 reason,
        uint48 timestamp
    );

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    /// @notice Deploys the consumer with a reference to the ReputationRegistry.
    /// @param _registry Address of the deployed ReputationRegistry.
    /// @param _creForwarder Address of the CRE forwarder contract (or EOA for testing).
    constructor(address _registry, address _creForwarder) {
        if (_registry == address(0)) revert InvalidRegistry();

        reputationRegistry = ReputationRegistry(_registry);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CRE_FORWARDER_ROLE, _creForwarder);
    }

    // ──────────────────────────────────────────────
    //  CRE Report Entry Point
    // ──────────────────────────────────────────────

    /// @notice Called by the CRE forwarder to deliver a reputation report.
    /// @dev Decodes the ABI-encoded payload as (address agent, uint16 score, bytes32 reason).
    ///      Enforces monotonic timestamps and score range [0, 1000].
    /// @param reportPayload ABI-encoded payload from the CRE workflow.
    function onReport(bytes calldata reportPayload) external onlyRole(CRE_FORWARDER_ROLE) {
        (address agent, uint16 score, bytes32 reason) = abi.decode(
            reportPayload,
            (address, uint16, bytes32)
        );

        if (agent == address(0)) revert InvalidReportPayload();
        if (score > 1000) revert ScoreOutOfRange();

        uint48 ts = uint48(block.timestamp);

        // Replay protection: ensure this report is newer than the last one
        if (ts <= lastReportTimestamp[agent]) revert StaleReport();
        lastReportTimestamp[agent] = ts;

        // Forward the score update to ReputationRegistry
        reputationRegistry.updateScore(agent, score, reason);

        emit ReputationReportProcessed(agent, score, reason, ts);
    }

    // ──────────────────────────────────────────────
    //  Admin
    // ──────────────────────────────────────────────

    /// @notice Update the ReputationRegistry reference.
    /// @param _registry Address of the new ReputationRegistry contract.
    function setReputationRegistry(address _registry) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_registry == address(0)) revert InvalidRegistry();
        reputationRegistry = ReputationRegistry(_registry);
    }
}
