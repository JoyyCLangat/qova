// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {TransactionValidator} from "../src/TransactionValidator.sol";
import {BudgetEnforcer} from "../src/BudgetEnforcer.sol";
import {QovaCore} from "../src/QovaCore.sol";

contract QovaIntegrationTest is Test {
    ReputationRegistry public registry;
    TransactionValidator public validator;
    BudgetEnforcer public enforcer;
    QovaCore public core;

    address public admin = address(this);
    address public agent1 = makeAddr("agent1");
    address public operator = makeAddr("operator");
    address public unauthorized = makeAddr("unauthorized");

    bytes32 public constant TX_HASH_1 = keccak256("tx1");
    bytes32 public constant TX_HASH_2 = keccak256("tx2");
    bytes32 public constant REASON_GOOD = keccak256("GOOD_BEHAVIOR");

    uint128 public constant DAILY_LIMIT = 10 ether;
    uint128 public constant MONTHLY_LIMIT = 100 ether;
    uint128 public constant PER_TX_LIMIT = 5 ether;

    function setUp() public {
        // Deploy all contracts
        registry = new ReputationRegistry();
        validator = new TransactionValidator(address(registry));
        enforcer = new BudgetEnforcer();
        core = new QovaCore(
            address(registry),
            address(validator),
            address(enforcer)
        );

        // Grant QovaCore the RECORDER_ROLE on TransactionValidator
        validator.grantRole(keccak256("RECORDER_ROLE"), address(core));

        // Grant QovaCore the BUDGET_MANAGER_ROLE on BudgetEnforcer
        enforcer.grantRole(keccak256("BUDGET_MANAGER_ROLE"), address(core));
    }

    // ──────────────────────────────────────────────
    //  test_FullFlow
    // ──────────────────────────────────────────────

    function test_FullFlow() public {
        // 1. Register agent in reputation registry
        registry.registerAgent(agent1);
        assertTrue(registry.isRegistered(agent1));
        assertEq(registry.getScore(agent1), 0);

        // 2. Set budget for agent
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);
        assertTrue(enforcer.hasBudget(agent1));

        // 3. Execute agent action through QovaCore
        uint256 amount = 3 ether;

        vm.expectEmit(true, true, false, true);
        emit QovaCore.AgentActionExecuted(
            agent1,
            TX_HASH_1,
            amount,
            TransactionValidator.TransactionType.PAYMENT,
            uint48(block.timestamp)
        );

        core.executeAgentAction(
            agent1,
            TX_HASH_1,
            amount,
            TransactionValidator.TransactionType.PAYMENT
        );

        // 4. Verify transaction stats
        TransactionValidator.TransactionStats memory stats = validator.getTransactionStats(agent1);
        assertEq(stats.totalCount, 1);
        assertEq(stats.totalVolume, uint128(amount));
        assertEq(stats.successCount, 1);

        // 5. Verify budget was spent
        BudgetEnforcer.BudgetStatus memory budgetStatus = enforcer.getBudgetStatus(agent1);
        assertEq(budgetStatus.dailySpent, uint128(amount));
        assertEq(budgetStatus.monthlySpent, uint128(amount));
        assertEq(budgetStatus.dailyRemaining, DAILY_LIMIT - uint128(amount));

        // 6. Update reputation score
        registry.updateScore(agent1, 850, REASON_GOOD);
        assertEq(registry.getScore(agent1), 850);

        // 7. Verify via QovaCore view helpers
        assertEq(core.getAgentScore(agent1), 850);
    }

    // ──────────────────────────────────────────────
    //  test_ExecuteAction_BudgetExceeded
    // ──────────────────────────────────────────────

    function test_ExecuteAction_BudgetExceeded() public {
        // Set a tight budget
        enforcer.setBudget(agent1, 2 ether, 100 ether, 1 ether);

        // This should fail because 2 ether > perTxLimit of 1 ether
        vm.expectRevert(QovaCore.BudgetCheckFailed.selector);
        core.executeAgentAction(
            agent1,
            TX_HASH_1,
            2 ether,
            TransactionValidator.TransactionType.PAYMENT
        );
    }

    // ──────────────────────────────────────────────
    //  test_ExecuteAction_NoBudget
    // ──────────────────────────────────────────────

    function test_ExecuteAction_NoBudget() public {
        // Do NOT set a budget -- action should succeed without budget enforcement
        core.executeAgentAction(
            agent1,
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );

        TransactionValidator.TransactionStats memory stats = validator.getTransactionStats(agent1);
        assertEq(stats.totalCount, 1);
        assertEq(stats.totalVolume, uint128(1 ether));
    }

    // ──────────────────────────────────────────────
    //  test_ExecuteAction_Paused
    // ──────────────────────────────────────────────

    function test_ExecuteAction_Paused() public {
        core.pause();

        vm.expectRevert();
        core.executeAgentAction(
            agent1,
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );
    }

    // ──────────────────────────────────────────────
    //  test_UpdateContractReferences
    // ──────────────────────────────────────────────

    function test_UpdateContractReferences() public {
        // Deploy new instances
        ReputationRegistry newRegistry = new ReputationRegistry();
        TransactionValidator newValidator = new TransactionValidator(address(newRegistry));
        BudgetEnforcer newEnforcer = new BudgetEnforcer();

        // Update references
        vm.expectEmit(false, false, false, true);
        emit QovaCore.ContractUpdated("ReputationRegistry", address(registry), address(newRegistry));
        core.setReputationRegistry(address(newRegistry));

        vm.expectEmit(false, false, false, true);
        emit QovaCore.ContractUpdated("TransactionValidator", address(validator), address(newValidator));
        core.setTransactionValidator(address(newValidator));

        vm.expectEmit(false, false, false, true);
        emit QovaCore.ContractUpdated("BudgetEnforcer", address(enforcer), address(newEnforcer));
        core.setBudgetEnforcer(address(newEnforcer));

        // Verify new references
        assertEq(address(core.reputationRegistry()), address(newRegistry));
        assertEq(address(core.transactionValidator()), address(newValidator));
        assertEq(address(core.budgetEnforcer()), address(newEnforcer));
    }

    // ──────────────────────────────────────────────
    //  test_UpdateContractReferences_Unauthorized
    // ──────────────────────────────────────────────

    function test_UpdateContractReferences_Unauthorized() public {
        address newAddr = makeAddr("newContract");

        vm.startPrank(unauthorized);

        vm.expectRevert();
        core.setReputationRegistry(newAddr);

        vm.expectRevert();
        core.setTransactionValidator(newAddr);

        vm.expectRevert();
        core.setBudgetEnforcer(newAddr);

        vm.stopPrank();
    }
}
