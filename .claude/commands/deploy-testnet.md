description: Deploy contracts to Base Sepolia testnet
---
Before deploying:
1. Use the security-auditor subagent to review all contract changes
2. Run forge test to ensure all tests pass
3. Run deployment script: `cd contracts && forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast`
4. Record deployed addresses in docs/integrations/base-deployments.md
5. Update qova-progress.txt
