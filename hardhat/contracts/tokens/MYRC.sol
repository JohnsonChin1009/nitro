// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MYRC is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18; // 1000 MYRC
    
    constructor() ERC20("MYRC Token", "MYRC") Ownable(msg.sender) {
        // Initial supply of 100 million MYRC
        _mint(msg.sender, 100_000_000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }
    
    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "MYRC: recipients and amounts length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
    
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "MYRC: recipients and amounts length mismatch");
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(balanceOf(msg.sender) >= totalAmount, "MYRC: insufficient balance for batch transfer");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
} 