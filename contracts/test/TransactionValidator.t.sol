// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {TransactionValidator} from "../src/TransactionValidator.sol";

contract TransactionValidatorTest is Test {
    ReputationRegistry public registry;
    TransactionValidator public validator;

    address public admin = address(this);
    address public agent1 = makeAddr("agent1");
    address public unauthorized = makeAddr("unauthorized");

    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");
    bytes32 public constant TX_HASH_1 = keccak256("tx1");
    bytes32 public constant TX_HASH_2 = keccak256("tx2");
    bytes32 public constant TX_HASH_3 = keccak256("tx3");

    function setUp() public {
        registry = new ReputationRegistry();
        validator = new TransactionValidator(address(registry));
    }

    // ──────────────────────────────────────────────
    //  test_RecordTransaction
    // ──────────────────────────────────────────────

    function test_RecordTransaction() public {
        uint256 amount = 1 ether;

        vm.expectEmit(true, true, false, true);
        emit TransactionValidator.TransactionRecorded(
            agent1,
            TX_HASH_1,
            amount,
            TransactionValidator.TransactionType.PAYMENT,
            uint48(block.timestamp)
        );

        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            amount,
            TransactionValidator.TransactionType.PAYMENT
        );

        TransactionValidator.TransactionStats memory stats = validator.getTransactionStats(agent1);
        assertEq(stats.totalCount, 1);
        assertEq(stats.totalVolume, uint128(amount));
        assertEq(stats.successCount, 1);
        assertEq(stats.lastActivityTimestamp, uint48(block.timestamp));
    }

    // ──────────────────────────────────────────────
    //  test_RecordTransaction_UpdatesStats
    // ──────────────────────────────────────────────

    function test_RecordTransaction_UpdatesStats() public {
        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );

        validator.recordTransaction(
            agent1,
            TX_HASH_2,
            2 ether,
            TransactionValidator.TransactionType.SWAP
        );

        validator.recordTransaction(
            agent1,
            TX_HASH_3,
            0.5 ether,
            TransactionValidator.TransactionType.TRANSFER
        );

        TransactionValidator.TransactionStats memory stats = validator.getTransactionStats(agent1);
        assertEq(stats.totalCount, 3);
        assertEq(stats.totalVolume, uint128(3.5 ether));
        assertEq(stats.successCount, 3);
    }

    // ──────────────────────────────────────────────
    //  test_RecordTransaction_Unauthorized
    // ──────────────────────────────────────────────

    function test_RecordTransaction_Unauthorized() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );
    }

    // ──────────────────────────────────────────────
    //  test_RecordTransaction_ZeroAddress
    // ──────────────────────────────────────────────

    function test_RecordTransaction_ZeroAddress() public {
        vm.expectRevert(TransactionValidator.ZeroAddress.selector);
        validator.recordTransaction(
            address(0),
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );
    }

    // ──────────────────────────────────────────────
    //  test_RecordTransaction_ZeroAmount
    // ──────────────────────────────────────────────

    function test_RecordTransaction_ZeroAmount() public {
        vm.expectRevert(TransactionValidator.ZeroAmount.selector);
        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            0,
            TransactionValidator.TransactionType.PAYMENT
        );
    }

    // ──────────────────────────────────────────────
    //  test_GetSuccessRate
    // ──────────────────────────────────────────────

    function test_GetSuccessRate() public {
        // All transactions recorded via recordTransaction are successes,
        // so success rate should be 10000 (100.00%)
        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            1 ether,
            TransactionValidator.TransactionType.PAYMENT
        );

        validator.recordTransaction(
            agent1,
            TX_HASH_2,
            2 ether,
            TransactionValidator.TransactionType.SWAP
        );

        uint256 rate = validator.getSuccessRate(agent1);
        assertEq(rate, 10_000); // 100.00%
    }

    // ──────────────────────────────────────────────
    //  test_GetSuccessRate_NoTransactions
    // ──────────────────────────────────────────────

    function test_GetSuccessRate_NoTransactions() public view {
        uint256 rate = validator.getSuccessRate(agent1);
        assertEq(rate, 0);
    }

    // ──────────────────────────────────────────────
    //  testFuzz_RecordTransaction
    // ──────────────────────────────────────────────

    function testFuzz_RecordTransaction(uint128 amount) public {
        vm.assume(amount > 0);

        validator.recordTransaction(
            agent1,
            TX_HASH_1,
            uint256(amount),
            TransactionValidator.TransactionType.PAYMENT
        );

        TransactionValidator.TransactionStats memory stats = validator.getTransactionStats(agent1);
        assertEq(stats.totalCount, 1);
        assertEq(stats.totalVolume, amount);
        assertEq(stats.successCount, 1);
    }
}
