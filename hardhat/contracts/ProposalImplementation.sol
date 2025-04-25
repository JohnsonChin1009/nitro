// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol"; // Import Clones
import "./LendingPool.sol"; // Need LendingPool for the finalize function
import "./DAOImplementation.sol"; // Need DAOImplementation to call back

contract ProposalImplementation is Initializable {
    using Clones for address; // Use Clones for address type

    enum ProposalStatus { Active, Approved, Rejected, Executed }
    
    struct ProposalData {
        uint256 proposalId;
        string name;
        string description;
        address tokenType;
        uint256 interestRate;
        uint256 maximumTVL;
        address proposer;
        uint8 quorum;
        uint8 minimumParticipation;
        uint256 votingDeadline;
        address daoAddress;
        address governanceToken;
        uint256 poolQuorum;
        uint256 closingDays;
        uint256 minimumStakerBalance;
    }
    
    uint256 public proposalId;
    string public name;
    string public description;
    address public tokenType;
    uint256 public interestRate;
    uint256 public maximumTVL;
    address public proposer;
    uint8 public quorum;
    uint8 public minimumParticipation;
    uint256 public votingDeadline;
    address public daoAddress;
    address public governanceToken;
    uint256 public poolQuorum;
    uint256 public expirationDate;
    uint256 public minimumStakerBalance;
    
    uint256 public totalVotes;
    uint256 public yesVotes;
    uint256 public noVotes;
    mapping(address => bool) public hasVoted;
    ProposalStatus public status;
    
    mapping(address => uint256) public stakerAmounts;
    address[] public stakers;
    uint256 public totalStakeCommitted;
    bool public isPoolCreated;
    
    event Voted(address indexed voter, bool vote, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event StakeCommitted(address indexed staker, uint256 amount);
    event LendingPoolCreated(address indexed poolAddress, uint256 totalStaked);
    event StakeWithdrawn(address indexed staker, uint256 amount);

    function initialize(
        ProposalData memory data
    ) public initializer {
        proposalId = data.proposalId;
        name = data.name;
        description = data.description;
        tokenType = data.tokenType;
        interestRate = data.interestRate;
        maximumTVL = data.maximumTVL;
        proposer = data.proposer;
        quorum = data.quorum;
        minimumParticipation = data.minimumParticipation;
        votingDeadline = data.votingDeadline;
        daoAddress = data.daoAddress;
        governanceToken = data.governanceToken;
        poolQuorum = data.poolQuorum;
        expirationDate = block.timestamp + (data.closingDays * 1 days);
        minimumStakerBalance = data.minimumStakerBalance;
        status = ProposalStatus.Active;
    }

    function vote(bool support) external {
        require(block.timestamp < votingDeadline, "Voting period ended");
        require(status == ProposalStatus.Active, "Proposal not active");
        require(!hasVoted[msg.sender], "Already voted");
        
        // Remove check against staking token balance for voting eligibility
        // uint256 stakingTokenBalance = IERC20(tokenType).balanceOf(msg.sender);
        // require(stakingTokenBalance >= minimumStakerBalance, "Insufficient staking token balance to vote");

        // Require voter to hold at least some governance tokens
        require(IERC20(governanceToken).balanceOf(msg.sender) > 0, "Must hold governance tokens to vote");

        // Set a fixed voter weight of 100 tokens (assuming 18 decimals)
        uint256 voterWeight = 100 * (10**18); 
        
        hasVoted[msg.sender] = true;
        
        if (support) {
            yesVotes += voterWeight;
        } else {
            noVotes += voterWeight;
        }
        
        totalVotes += voterWeight;
        
        emit Voted(msg.sender, support, voterWeight);
    }
    
    function commitStake(uint256 _amount) external {
        require(status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp < votingDeadline, "Voting period ended");
        require(IERC20(tokenType).balanceOf(msg.sender) >= _amount, 
                "Insufficient staking token balance for this amount");
        require(_amount > 0, "Amount must be greater than 0");
                
        uint256 newTotalStakeCommitted = totalStakeCommitted + _amount;
        require(newTotalStakeCommitted <= maximumTVL, "Exceeds maximum TVL");

        if (stakerAmounts[msg.sender] == 0) {
            stakers.push(msg.sender);
        }
        
        stakerAmounts[msg.sender] += _amount;
        totalStakeCommitted += _amount;

        require(IERC20(tokenType).transferFrom(msg.sender, address(this), _amount), "Stake transfer failed");

        emit StakeCommitted(msg.sender, _amount);
    }

    // --- NEW FINALIZE FUNCTION ---
    // Allows finalization as soon as any stake is committed, bypassing voting checks.
    function finalize() external {
        require(status == ProposalStatus.Active, "Proposal already finalized");
        require(totalStakeCommitted > 0, "No stake committed yet"); // Check for stake

        status = ProposalStatus.Approved;

        if (!isPoolCreated) { // Prevent re-creation
            // Get LendingPool logic address from DAO
            address lpLogic = DAOImplementation(daoAddress).lendingPoolLogic();
            require(lpLogic != address(0), "LP Logic not set in DAO");

            // Deploy LendingPool clone
            address poolAddress = lpLogic.clone();
            LendingPool pool = LendingPool(poolAddress);

            DAOImplementation(daoAddress).registerLendingPool(proposalId, poolAddress);
            isPoolCreated = true;
            // Initialize the LendingPool clone
            pool.initialize(
                name, // Use proposal name/desc for pool?
                description,
                tokenType,
                interestRate,
                poolQuorum,
                expirationDate,
                address(this), // Creator is this proposal contract
                daoAddress,
                minimumStakerBalance,
                governanceToken
            );

            for (uint i = 0; i < stakers.length; i++) {
                address staker = stakers[i];
                uint256 amount = stakerAmounts[staker];
                if (amount > 0) {
                    // Transfer directly from this contract to the pool
                    require(
                        IERC20(tokenType).transfer(address(pool), amount),
                        "Pool funding transfer failed"
                    );
                    // Initialize stake in the pool
                    pool.initializeStake(staker, amount);
                }
            }

            emit LendingPoolCreated(poolAddress, totalStakeCommitted);
            DAOImplementation(daoAddress).onProposalApproved(proposalId); // Call DAO *after* pool is funded
        }

        emit ProposalExecuted(proposalId);
    }
    // --- END NEW FINALIZE FUNCTION ---

    // Keep the commented-out old finalize function for reference if needed
    // function finalize() external {
    
    function getVotingResults() external view returns (
        uint256 _totalVotes,
        uint256 _yesVotes,
        uint256 _noVotes,
        uint256 _quorumVotes,
        uint256 _minimumVotesNeeded
    ) {
        uint256 totalSupply = IERC20(governanceToken).totalSupply();
        uint256 quorumVotes = (totalVotes * quorum) / 100;
        uint256 minimumVotesNeeded = (totalSupply * minimumParticipation) / 100;
        return (totalVotes, yesVotes, noVotes, quorumVotes, minimumVotesNeeded);
    }
    
    function canFinalize() external view returns (bool) {
        if (status != ProposalStatus.Active) {
            return false;
        }

        uint256 totalSupply = IERC20(governanceToken).totalSupply();
        uint256 minimumVotesNeeded = (totalSupply * minimumParticipation) / 100;
        bool participationMet = totalVotes >= minimumVotesNeeded;
        bool quorumMet = totalVotes > 0 && yesVotes >= (totalVotes * poolQuorum) / 100;
        bool deadlinePassed = block.timestamp >= votingDeadline;

        return deadlinePassed || (quorumMet && participationMet);
    }
    
    function getStakers() external view returns (
        address[] memory _stakers,
        uint256[] memory _amounts
    ) {
        uint256[] memory amounts = new uint256[](stakers.length);
        for (uint i = 0; i < stakers.length; i++) {
            amounts[i] = stakerAmounts[stakers[i]];
        }
        return (stakers, amounts);
    }
    
    function getProposalDetails() external view returns (
        string memory _name,
        string memory _description,
        address _tokenType,
        uint256 _interestRate,
        uint256 _maximumTVL,
        address _proposer,
        uint256 _poolQuorum,
        uint256 _expirationDate,
        uint256 _minimumStakerBalance,
        ProposalStatus _status
    ) {
        return (
            name,
            description,
            tokenType,
            interestRate,
            maximumTVL,
            proposer,
            poolQuorum,
            expirationDate,
            minimumStakerBalance,
            status
        );
    }

    /**
     * @notice Allows a staker to withdraw their committed stake IF the proposal was Rejected.
     */
    function withdrawStake() external {
        require(status == ProposalStatus.Rejected, "Withdrawal only allowed for rejected proposals");
        uint256 amount = stakerAmounts[msg.sender];
        require(amount > 0, "No stake found for sender");

        // Reset stake amount first to prevent re-entrancy issues
        stakerAmounts[msg.sender] = 0;

        // Subtract from total (assuming stakers array isn't modified for simplicity)
        // Be mindful if you sum up amounts elsewhere, this might need adjustment
        totalStakeCommitted -= amount;

        // Transfer tokens back to the staker
        require(IERC20(tokenType).transfer(msg.sender, amount), "Withdrawal transfer failed");

        emit StakeWithdrawn(msg.sender, amount);
    }
} 