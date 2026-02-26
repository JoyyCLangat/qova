// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {TransactionValidator} from "../src/TransactionValidator.sol";
import {BudgetEnforcer} from "../src/BudgetEnforcer.sol";
import {QovaCore} from "../src/QovaCore.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ReputationRegistry registry = new ReputationRegistry();
        TransactionValidator validator = new TransactionValidator(address(registry));
        BudgetEnforcer enforcer = new BudgetEnforcer();
        QovaCore core = new QovaCore(
            address(registry),
            address(validator),
            address(enforcer)
        );

        // Grant OPERATOR_ROLE to QovaCore on sub-contracts
        // so QovaCore can call recordTransaction, recordSpend, etc.
        // This depends on the actual role constants in each contract

        console.log("ReputationRegistry:", address(registry));
        console.log("TransactionValidator:", address(validator));
        console.log("BudgetEnforcer:", address(enforcer));
        console.log("QovaCore:", address(core));

        vm.stopBroadcast();
    }
}
