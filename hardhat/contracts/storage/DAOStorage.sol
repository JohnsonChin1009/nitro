// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DAOStorage {
    string public name;
    address public governanceToken;
    address public admin;
    uint8 public quorum;
    uint8 public minimumParticipation;
    uint256 public votingPeriod;
    address public usdcToken;
    
    mapping(uint256 => address) public proposals;
    uint256 public proposalCount;
    mapping(address => bool) public lendingPools;
}