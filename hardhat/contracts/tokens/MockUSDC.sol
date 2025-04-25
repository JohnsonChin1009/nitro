// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**6; // 1000 Mock USDC
    
    constructor() ERC20("Mock USD Coin", "MockUSDC") Ownable(msg.sender) {
        // Initial supply of 1 billion USDC
        _mint(msg.sender, 1_000_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDC uses 6 decimals
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "USDC: recipients and amounts length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
} 