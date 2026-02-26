// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {BudgetEnforcer} from "../src/BudgetEnforcer.sol";

contract BudgetEnforcerTest is Test {
    BudgetEnforcer public enforcer;

    address public admin = address(this);
    address public agent1 = makeAddr("agent1");

    uint128 public constant DAILY_LIMIT = 10 ether;
    uint128 public constant MONTHLY_LIMIT = 100 ether;
    uint128 public constant PER_TX_LIMIT = 5 ether;

    function setUp() public {
        enforcer = new BudgetEnforcer();
    }

    // ──────────────────────────────────────────────
    //  test_SetBudget
    // ──────────────────────────────────────────────

    function test_SetBudget() public {
        vm.expectEmit(true, false, false, true);
        emit BudgetEnforcer.BudgetSet(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        assertTrue(enforcer.hasBudget(agent1));

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailyRemaining, DAILY_LIMIT);
        assertEq(status.monthlyRemaining, MONTHLY_LIMIT);
        assertEq(status.perTxLimit, PER_TX_LIMIT);
        assertEq(status.dailySpent, 0);
        assertEq(status.monthlySpent, 0);
    }

    // ──────────────────────────────────────────────
    //  test_CheckBudget_WithinLimits
    // ──────────────────────────────────────────────

    function test_CheckBudget_WithinLimits() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        bool allowed = enforcer.checkBudget(agent1, 3 ether);
        assertTrue(allowed);
    }

    // ──────────────────────────────────────────────
    //  test_CheckBudget_PerTxExceeded
    // ──────────────────────────────────────────────

    function test_CheckBudget_PerTxExceeded() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        bool allowed = enforcer.checkBudget(agent1, 6 ether); // exceeds 5 ether perTxLimit
        assertFalse(allowed);
    }

    // ──────────────────────────────────────────────
    //  test_RecordSpend
    // ──────────────────────────────────────────────

    function test_RecordSpend() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        vm.expectEmit(true, false, false, true);
        emit BudgetEnforcer.SpendRecorded(
            agent1,
            3 ether,
            DAILY_LIMIT - 3 ether,     // dailyRemaining
            MONTHLY_LIMIT - 3 ether    // monthlyRemaining
        );

        enforcer.recordSpend(agent1, 3 ether);

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailySpent, 3 ether);
        assertEq(status.monthlySpent, 3 ether);
        assertEq(status.dailyRemaining, DAILY_LIMIT - 3 ether);
        assertEq(status.monthlyRemaining, MONTHLY_LIMIT - 3 ether);
    }

    // ──────────────────────────────────────────────
    //  test_RecordSpend_DailyLimitReached
    // ──────────────────────────────────────────────

    function test_RecordSpend_DailyLimitReached() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        // Spend up to the per-tx limit twice (5 + 5 = 10 = daily limit)
        enforcer.recordSpend(agent1, PER_TX_LIMIT);
        enforcer.recordSpend(agent1, PER_TX_LIMIT);

        // Next spend should exceed daily limit
        vm.expectRevert(
            abi.encodeWithSelector(
                BudgetEnforcer.DailyLimitReached.selector,
                uint128(1 ether),
                uint128(0) // no remaining
            )
        );
        enforcer.recordSpend(agent1, 1 ether);
    }

    // ──────────────────────────────────────────────
    //  test_RecordSpend_MonthlyLimitReached
    // ──────────────────────────────────────────────

    function test_RecordSpend_MonthlyLimitReached() public {
        // Set a high daily limit but low monthly limit so we hit monthly first
        enforcer.setBudget(agent1, 200 ether, 10 ether, 5 ether);

        // Spend 5 + 5 = 10 (monthly limit)
        enforcer.recordSpend(agent1, 5 ether);
        enforcer.recordSpend(agent1, 5 ether);

        // Next should revert with MonthlyLimitReached
        vm.expectRevert(
            abi.encodeWithSelector(
                BudgetEnforcer.MonthlyLimitReached.selector,
                uint128(1 ether),
                uint128(0) // no remaining
            )
        );
        enforcer.recordSpend(agent1, 1 ether);
    }

    // ──────────────────────────────────────────────
    //  test_DailyReset
    // ──────────────────────────────────────────────

    function test_DailyReset() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        // Spend the full daily limit
        enforcer.recordSpend(agent1, PER_TX_LIMIT);
        enforcer.recordSpend(agent1, PER_TX_LIMIT);

        // Warp forward 1 day
        vm.warp(block.timestamp + 1 days);

        // Should be able to spend again after daily reset
        enforcer.recordSpend(agent1, 3 ether);

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailySpent, 3 ether);
        // Monthly should accumulate (10 + 3 = 13)
        assertEq(status.monthlySpent, 13 ether);
    }

    // ──────────────────────────────────────────────
    //  test_MonthlyReset
    // ──────────────────────────────────────────────

    function test_MonthlyReset() public {
        // Set limits: high daily, moderate monthly, moderate per-tx
        enforcer.setBudget(agent1, 200 ether, 20 ether, 10 ether);

        // Spend close to monthly limit
        enforcer.recordSpend(agent1, 10 ether);
        enforcer.recordSpend(agent1, 10 ether);

        // Warp forward 30 days
        vm.warp(block.timestamp + 30 days);

        // Should be able to spend again after monthly (and daily) reset
        enforcer.recordSpend(agent1, 5 ether);

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailySpent, 5 ether);
        assertEq(status.monthlySpent, 5 ether);
    }

    // ──────────────────────────────────────────────
    //  test_GetBudgetStatus
    // ──────────────────────────────────────────────

    function test_GetBudgetStatus() public {
        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        enforcer.recordSpend(agent1, 2 ether);
        enforcer.recordSpend(agent1, 3 ether);

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailyRemaining, DAILY_LIMIT - 5 ether);
        assertEq(status.monthlyRemaining, MONTHLY_LIMIT - 5 ether);
        assertEq(status.perTxLimit, PER_TX_LIMIT);
        assertEq(status.dailySpent, 5 ether);
        assertEq(status.monthlySpent, 5 ether);
    }

    // ──────────────────────────────────────────────
    //  testFuzz_RecordSpend
    // ──────────────────────────────────────────────

    function testFuzz_RecordSpend(uint128 amount) public {
        // Bound amount to be within per-tx and daily limits
        amount = uint128(bound(amount, 1, uint256(PER_TX_LIMIT)));

        enforcer.setBudget(agent1, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT);

        enforcer.recordSpend(agent1, amount);

        BudgetEnforcer.BudgetStatus memory status = enforcer.getBudgetStatus(agent1);
        assertEq(status.dailySpent, amount);
        assertEq(status.monthlySpent, amount);
    }
}
