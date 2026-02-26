# contracts/ -- Qova Smart Contracts

## Overview
Solidity smart contracts deployed on Base L2 (Base Sepolia for testnet).
Built with Foundry (forge, cast, anvil). NOT Hardhat.

## Contracts
- `QovaIdentityRegistry.sol` -- ERC-8004 compatible, ERC-721 NFT identity for AI agents
- `QovaReputationRegistry.sol` -- Financial feedback storage, on-chain score snapshots
- `QovaFacilitator.sol` -- x402 payment processing, transaction data capture

## Conventions
- Solidity 0.8.28+ with pinned pragma
- OpenZeppelin v5 contracts as base (AccessControl, ReentrancyGuard, ERC721)
- Custom errors instead of require strings: `error Unauthorized();`
- NatSpec on every external/public function
- Events for every state change
- Checks-effects-interactions pattern strictly enforced

## File Structure
- `src/` -- Production contracts
- `test/` -- Forge test files (unit, fuzz, invariant)
- `script/` -- Deployment scripts (Deploy.s.sol)
- `foundry.toml` -- Foundry configuration

## Commands
```bash
forge build          # Compile
forge test -vvv      # Run tests with verbosity
forge test --gas-report  # Gas usage report
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast  # Deploy
```

## Security
- Reentrancy guards on all value-handling functions
- AccessControl for role-based permissions (not Ownable)
- Never use tx.origin, transfer(), or send()
- All external calls follow checks-effects-interactions
