// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";

contract ReputationRegistryTest is Test {
    ReputationRegistry public registry;

    address public admin = address(this);
    address public agent1 = makeAddr("agent1");
    address public agent2 = makeAddr("agent2");
    address public agent3 = makeAddr("agent3");
    address public unauthorized = makeAddr("unauthorized");

    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    bytes32 public constant REASON_GOOD = keccak256("GOOD_BEHAVIOR");

    function setUp() public {
        registry = new ReputationRegistry();
    }

    // ──────────────────────────────────────────────
    //  test_RegisterAgent
    // ──────────────────────────────────────────────

    function test_RegisterAgent() public {
        vm.expectEmit(true, false, false, true);
        emit ReputationRegistry.AgentRegistered(agent1, uint48(block.timestamp));

        registry.registerAgent(agent1);

        assertTrue(registry.isRegistered(agent1));

        ReputationRegistry.AgentDetails memory details = registry.getAgentDetails(agent1);
        assertEq(details.score, 0);
        assertEq(details.lastUpdated, uint48(block.timestamp));
        assertEq(details.updateCount, 0);
        assertTrue(details.registered);
    }

    // ──────────────────────────────────────────────
    //  test_RegisterAgent_AlreadyRegistered
    // ──────────────────────────────────────────────

    function test_RegisterAgent_AlreadyRegistered() public {
        registry.registerAgent(agent1);

        vm.expectRevert(ReputationRegistry.AgentAlreadyRegistered.selector);
        registry.registerAgent(agent1);
    }

    // ──────────────────────────────────────────────
    //  test_RegisterAgent_Unauthorized
    // ──────────────────────────────────────────────

    function test_RegisterAgent_Unauthorized() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        registry.registerAgent(agent1);
    }

    // ──────────────────────────────────────────────
    //  test_UpdateScore
    // ──────────────────────────────────────────────

    function test_UpdateScore() public {
        registry.registerAgent(agent1);

        vm.expectEmit(true, false, false, true);
        emit ReputationRegistry.ScoreUpdated(agent1, 0, 750, REASON_GOOD, uint48(block.timestamp));

        registry.updateScore(agent1, 750, REASON_GOOD);

        assertEq(registry.getScore(agent1), 750);

        ReputationRegistry.AgentDetails memory details = registry.getAgentDetails(agent1);
        assertEq(details.updateCount, 1);
    }

    // ──────────────────────────────────────────────
    //  test_UpdateScore_AgentNotRegistered
    // ──────────────────────────────────────────────

    function test_UpdateScore_AgentNotRegistered() public {
        vm.expectRevert(ReputationRegistry.AgentNotRegistered.selector);
        registry.updateScore(agent1, 500, REASON_GOOD);
    }

    // ──────────────────────────────────────────────
    //  test_UpdateScore_InvalidScore
    // ──────────────────────────────────────────────

    function test_UpdateScore_InvalidScore() public {
        registry.registerAgent(agent1);

        vm.expectRevert(ReputationRegistry.InvalidScore.selector);
        registry.updateScore(agent1, 1001, REASON_GOOD);
    }

    // ──────────────────────────────────────────────
    //  test_BatchUpdateScores
    // ──────────────────────────────────────────────

    function test_BatchUpdateScores() public {
        registry.registerAgent(agent1);
        registry.registerAgent(agent2);
        registry.registerAgent(agent3);

        address[] memory agents = new address[](3);
        agents[0] = agent1;
        agents[1] = agent2;
        agents[2] = agent3;

        uint16[] memory scores = new uint16[](3);
        scores[0] = 800;
        scores[1] = 600;
        scores[2] = 950;

        bytes32[] memory reasons = new bytes32[](3);
        reasons[0] = REASON_GOOD;
        reasons[1] = REASON_GOOD;
        reasons[2] = REASON_GOOD;

        registry.batchUpdateScores(agents, scores, reasons);

        assertEq(registry.getScore(agent1), 800);
        assertEq(registry.getScore(agent2), 600);
        assertEq(registry.getScore(agent3), 950);
    }

    // ──────────────────────────────────────────────
    //  test_BatchUpdateScores_ArrayMismatch
    // ──────────────────────────────────────────────

    function test_BatchUpdateScores_ArrayMismatch() public {
        address[] memory agents = new address[](2);
        agents[0] = agent1;
        agents[1] = agent2;

        uint16[] memory scores = new uint16[](1);
        scores[0] = 500;

        bytes32[] memory reasons = new bytes32[](2);
        reasons[0] = REASON_GOOD;
        reasons[1] = REASON_GOOD;

        vm.expectRevert(ReputationRegistry.ArrayLengthMismatch.selector);
        registry.batchUpdateScores(agents, scores, reasons);
    }

    // ──────────────────────────────────────────────
    //  test_GetScore_DefaultZero
    // ──────────────────────────────────────────────

    function test_GetScore_DefaultZero() public {
        // getScore reverts for unregistered agents, so we check via getAgentDetails
        ReputationRegistry.AgentDetails memory details = registry.getAgentDetails(agent1);
        assertEq(details.score, 0);
        assertFalse(details.registered);
    }

    // ──────────────────────────────────────────────
    //  test_Pausable
    // ──────────────────────────────────────────────

    function test_Pausable() public {
        registry.pause();

        vm.expectRevert();
        registry.registerAgent(agent1);

        vm.expectRevert();
        registry.updateScore(agent1, 500, REASON_GOOD);

        // Unpause and verify operations work again
        registry.unpause();
        registry.registerAgent(agent1);
        assertTrue(registry.isRegistered(agent1));
    }

    // ──────────────────────────────────────────────
    //  testFuzz_UpdateScore
    // ──────────────────────────────────────────────

    function testFuzz_UpdateScore(uint16 score) public {
        score = uint16(bound(score, 0, 1000));

        registry.registerAgent(agent1);
        registry.updateScore(agent1, score, REASON_GOOD);

        assertEq(registry.getScore(agent1), score);
    }
}
