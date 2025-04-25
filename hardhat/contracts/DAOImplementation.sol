// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./storage/DAOStorage.sol";
import "./LendingPool.sol";
import "./ProposalImplementation.sol";

contract DAOImplementation is Initializable, Ownable2StepUpgradeable, DAOStorage {
    using Clones for address;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, address proposalAddress);
    event ProposalApproved(uint256 indexed proposalId);
    event ProposalRejected(uint256 indexed proposalId);
    event ForcedLendingPoolCreated(address indexed poolAddress, address indexed creator);

    address public proposalLogic;
    address public lendingPoolLogic;
    mapping(uint256 => address) public proposalToLendingPool;

    struct DAOData {
        string name;
        address governanceToken;
        uint8 quorum;
        uint8 minimumParticipation;
        uint256 votingPeriod;
        address admin;
        address usdcToken;
        address proposalImplementationLogic;
    }

    function initialize(
        address creator,
        DAOData memory data
    ) public initializer {
        __Ownable2Step_init();
        name = data.name;
        governanceToken = data.governanceToken;
        quorum = data.quorum;
        minimumParticipation = data.minimumParticipation;
        votingPeriod = data.votingPeriod * 1 days;
        admin = data.admin;
        usdcToken = data.usdcToken;
        proposalLogic = data.proposalImplementationLogic;
        require(proposalLogic != address(0), "Proposal logic cannot be zero address");
        
        if (creator != data.admin) {
             _transferOwnership(data.admin);
        }
    }

    function createStakingProposal(
        string memory poolName,
        string memory poolDescription,
        address tokenType,
        uint256 interestRate,
        uint256 minimumStakerBalance,
        uint256 maximumTVL,
        uint8 proposalQuorum,
        uint256 closingDays
    ) external returns (address) {
        require(proposalQuorum >= 51, "Quorum must be at least 51%");
        require(proposalLogic != address(0), "Proposal logic not set");
        
        address proposalAddress = proposalLogic.clone();
        
        ProposalImplementation.ProposalData memory proposalData = ProposalImplementation.ProposalData({
            proposalId: proposalCount,
            name: poolName,
            description: poolDescription,
            tokenType: tokenType,
            interestRate: interestRate,
            maximumTVL: maximumTVL,
            proposer: msg.sender,
            quorum: proposalQuorum,
            minimumParticipation: minimumParticipation,
            votingDeadline: block.timestamp + votingPeriod,
            daoAddress: address(this),
            governanceToken: governanceToken,
            poolQuorum: proposalQuorum,
            closingDays: closingDays,
            minimumStakerBalance: minimumStakerBalance
        });

        ProposalImplementation(proposalAddress).initialize(proposalData);
        
        proposals[proposalCount] = proposalAddress;
        proposalCount++;
        
        emit ProposalCreated(proposalCount - 1, msg.sender, proposalAddress);
        return proposalAddress;
    }

    function forceCreateLendingPool(
        string memory _name,
        string memory _description,
        address _tokenAddress,
        uint256 _interestRate,
        uint256 _poolQuorum,
        uint256 _expirationDate,
        uint256 _minimumStakerBalance,
        uint256 _initialStakeAmount
    ) external onlyOwner returns (address) {


        IERC20 token = IERC20(_tokenAddress);
        address poolAddress = lendingPoolLogic.clone();

        LendingPool(poolAddress).initialize(
            _name,
            _description,
            _tokenAddress,
            _interestRate,
            _poolQuorum,
            _expirationDate,
            address(this),
            address(this),
            _minimumStakerBalance,
            governanceToken 
        );

        token.approve(poolAddress, _initialStakeAmount);
        
        LendingPool(poolAddress).initializeStake(msg.sender, _initialStakeAmount);

        emit ForcedLendingPoolCreated(poolAddress, msg.sender);
        return poolAddress;
    }

    function registerLendingPool(uint256 _proposalId, address _poolAddress) external {
        require(proposals[_proposalId] == msg.sender, "Only associated proposal can register pool");
        require(proposalToLendingPool[_proposalId] == address(0), "Pool already registered for this proposal");
        proposalToLendingPool[_proposalId] = _poolAddress;
    }   

    function getAllRegisteredLendingPools() external view returns (address[] memory poolAddresses) {
        uint256 count = proposalCount; // Get the total number of proposals created
        uint256 registeredPoolCount = 0;

        // First loop: Count how many pools are actually registered (non-zero address)
        // This avoids allocating an unnecessarily large array if many proposals didn't create a pool.
        for (uint256 i = 0; i < count; i++) {
            if (proposalToLendingPool[i] != address(0)) {
                registeredPoolCount++;
            }
        }

        // Allocate the memory array with the exact size needed
        poolAddresses = new address[](registeredPoolCount);
        uint256 currentIndex = 0;

        // Second loop: Populate the array
        for (uint256 i = 0; i < count; i++) {
            address poolAddr = proposalToLendingPool[i];
            if (poolAddr != address(0)) {
                poolAddresses[currentIndex] = poolAddr;
                currentIndex++;
            }
        }

        return poolAddresses;
    }

    function onProposalApproved(uint256 _proposalId) external {
        require(proposals[_proposalId] == msg.sender, "Only proposal can call");
        emit ProposalApproved(_proposalId);
    }

    function onProposalRejected(uint256 _proposalId) external {
        require(proposals[_proposalId] == msg.sender, "Only proposal can call");
        emit ProposalRejected(_proposalId);
    }

    /**
     * @notice Sets the implementation contract for LendingPool
     * @param _logic Address of the LendingPool logic contract
     */
    function setLendingPoolLogic(address _logic) external onlyOwner {
        require(_logic != address(0), "Logic cannot be zero address");
        lendingPoolLogic = _logic;
    }
} 