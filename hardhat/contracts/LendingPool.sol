// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LendingPool is Initializable, ReentrancyGuardUpgradeable {
    string public name;
    string public description;
    address public tokenAddress;
    uint256 public interestRate;
    uint256 public tvl;
    address public creator;
    address public daoAddress;
    uint256 public quorum;
    uint256 public expirationDate;
    bool public isActive;
    uint256 public minimumStakerBalance;
    address public governanceToken;
    
    // Staker data
    mapping(address => uint256) public stakeBalances;
    address[] public stakers;
    
    // Borrower data
    mapping(address => uint256) public borrowedAmount;
    mapping(address => uint256) public borrowerStakedAmount;
    mapping(address => uint256) public borrowStartTime;
    
    event Staked(address indexed staker, uint256 amount);
    event Borrowed(address indexed borrower, uint256 amount, uint256 stakedAmount);
    event Repaid(address indexed borrower, uint256 amount, uint256 interest);
    event Withdrawn(address indexed staker, uint256 amount);
    event PoolClosed(address indexed closer, uint256 timestamp);
    event ExpirationDateUpdated(uint256 newDate);
    event PoolInitialized();
    
    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Only DAO can call this");
        _;
    }

    modifier poolActive() {
        require(isActive && block.timestamp < expirationDate, "Pool is not active");
        _;
    }
    
    modifier onlyProposal() {
        require(msg.sender == creator, "Only proposal can initialize");
        _;
    }
    
    function initialize(
        string memory _name,
        string memory _description,
        address _tokenAddress,
        uint256 _interestRate,
        uint256 _quorum,
        uint256 _expirationDate,
        address _creator,
        address _daoAddress,
        uint256 _minimumStakerBalance,
        address _governanceToken
    ) public initializer {
        __ReentrancyGuard_init();

        name = _name;
        description = _description;
        tokenAddress = _tokenAddress;
        interestRate = _interestRate;
        quorum = _quorum;
        expirationDate = _expirationDate;
        creator = _creator;
        daoAddress = _daoAddress;
        minimumStakerBalance = _minimumStakerBalance;
        governanceToken = _governanceToken;
        isActive = true;

        emit PoolInitialized();
    }

    function initializeStake(address staker, uint256 amount) external onlyProposal {
        require(msg.sender == creator, "Only proposal can initialize stake");
        
        require(IERC20(tokenAddress).balanceOf(staker) >= minimumStakerBalance, 
                "Insufficient governance token balance");
                
        if (stakeBalances[staker] == 0) {
            stakers.push(staker);
        }
        
        stakeBalances[staker] += amount;
        tvl += amount;
        
        emit Staked(staker, amount);
    }

    function finalizeInitialization() external onlyProposal {
        // This function might become redundant if all setup happens in initialize 
        // and initializeStake. Consider removing if not strictly needed.
    }
    
    function stake(uint256 amount) external nonReentrant poolActive {
        require(amount > 0, "Amount must be greater than 0");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= minimumStakerBalance, 
                "Insufficient governance token balance");
        
        if (stakeBalances[msg.sender] == 0) {
            stakers.push(msg.sender);
        }
        
        stakeBalances[msg.sender] += amount;
        tvl += amount;
        
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        emit Staked(msg.sender, amount);
    }
    
    function borrow(uint256 amount) external nonReentrant poolActive {
        require(amount <= tvl, "Not enough liquidity");
        require(borrowedAmount[msg.sender] == 0, "Already has an active loan");
        
        // Require borrower to stake 5% of the borrowed amount
        uint256 requiredStake = (amount * 5) / 100;
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), requiredStake), "Stake transfer failed");
        
        borrowedAmount[msg.sender] = amount;
        borrowerStakedAmount[msg.sender] = requiredStake;
        borrowStartTime[msg.sender] = block.timestamp;
        
        // Update TVL: remove borrowed amount but add the staked amount
        tvl = tvl - amount + requiredStake;
        
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Borrow transfer failed");
        
        emit Borrowed(msg.sender, amount, requiredStake);
    }
    
    function repay(uint256 amount) external nonReentrant {
        require(borrowedAmount[msg.sender] > 0, "No active loan");
        
        uint256 interest = calculateInterest(msg.sender);
        uint256 totalDue = borrowedAmount[msg.sender] + interest;
        
        require(amount <= totalDue, "Amount exceeds total due");
        
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount), "Repayment transfer failed");
        
        tvl += amount;
        
        if (amount >= totalDue) {
            // Return the staked amount when loan is fully repaid
            uint256 stakedAmount = borrowerStakedAmount[msg.sender];
            
            borrowedAmount[msg.sender] = 0;
            borrowerStakedAmount[msg.sender] = 0;
            borrowStartTime[msg.sender] = 0;
            
            // Return the staked amount to the borrower
            require(IERC20(tokenAddress).transfer(msg.sender, stakedAmount), "Stake return failed");
            tvl -= stakedAmount;
        } else {
            borrowedAmount[msg.sender] -= (amount > interest ? amount - interest : 0);
        }
        
        emit Repaid(msg.sender, amount, interest);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(stakeBalances[msg.sender] >= amount, "Insufficient balance");
        require(tvl >= amount, "Not enough liquidity");
        
        stakeBalances[msg.sender] -= amount;
        tvl -= amount;
        
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Withdrawal failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function closePool() external {
        require(isActive, "Pool already closed");
        require(msg.sender == daoAddress || 
                (stakeBalances[msg.sender] > 0 && 
                 stakeBalances[msg.sender] * 100 / tvl >= 30), // Requires 30% of TVL
                "Not authorized to close pool");
        
        isActive = false;
        emit PoolClosed(msg.sender, block.timestamp);
    }
    
    function updateExpirationDate(uint256 newDate) external onlyDAO {
        require(newDate > block.timestamp, "Invalid expiration date");
        expirationDate = newDate;
        emit ExpirationDateUpdated(newDate);
    }
    
    function calculateInterest(address _borrower) public view returns (uint256) {
        if (borrowedAmount[_borrower] == 0) {
            return 0;
        }
        
        uint256 loanAmount = borrowedAmount[_borrower];
        uint256 loanDuration = block.timestamp - borrowStartTime[_borrower];
        
        return (loanAmount * interestRate * loanDuration) / (10000 * 365 days);
    }
    
    function getPoolInfo() external view returns (
        string memory _name,
        string memory _description,
        address _tokenAddress,
        uint256 _interestRate,
        uint256 _tvl,
        address _creator,
        uint256 _quorum,
        uint256 _expirationDate,
        bool _isActive,
        uint256 _stakerCount,
        uint256 _minimumStakerBalance,
        address _governanceToken
    ) {
        return (
            name,
            description,
            tokenAddress,
            interestRate,
            tvl,
            creator,
            quorum,
            expirationDate,
            isActive,
            stakers.length,
            minimumStakerBalance,
            governanceToken
        );
    }
} 