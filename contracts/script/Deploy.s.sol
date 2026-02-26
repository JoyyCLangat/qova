// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {TransactionValidator} from "../src/TransactionValidator.sol";
import {BudgetEnforcer} from "../src/BudgetEnforcer.sol";
import {QovaCore} from "../src/QovaCore.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        ReputationRegistry registry = new ReputationRegistry();
        TransactionValidator validator = new TransactionValidator(address(registry));
        BudgetEnforcer enforcer = new BudgetEnforcer();
        QovaCore core = new QovaCore(
            address(registry),
            address(validator),
            address(enforcer)
        );

        // Grant roles to QovaCore so it can orchestrate sub-contracts
        registry.grantRole(registry.UPDATER_ROLE(), address(core));
        validator.grantRole(validator.RECORDER_ROLE(), address(core));
        enforcer.grantRole(enforcer.BUDGET_MANAGER_ROLE(), address(core));

        console.log("=== Qova Deployment Complete ===");
        console.log("ReputationRegistry:", address(registry));
        console.log("TransactionValidator:", address(validator));
        console.log("BudgetEnforcer:", address(enforcer));
        console.log("QovaCore:", address(core));
        console.log("Deployer:", msg.sender);
        console.log("Chain ID:", block.chainid);

        vm.stopBroadcast();
    }
}
