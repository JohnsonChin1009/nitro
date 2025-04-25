"use client";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { GovernanceToken_ContractAddress } from "@/lib/contractAddress";
import { MYRC_ContractAddress } from "@/lib/contractAddress";
import { USDC_ContractAddress } from "@/lib/contractAddress";


// Contract addresses - Apply checksum to all addresses
const NITRO_ADDRESS = GovernanceToken_ContractAddress;
const MYRC_ADDRESS = MYRC_ContractAddress;
const USDC_ADDRESS = USDC_ContractAddress;

enum ProposalStatus {
  Active = 0,
  Approved = 1,
  Rejected = 2,
  Executed = 3
}

interface StakerInfo {
  address: string;
  amount: string;
}

interface Proposal {
  id: string; // Use address as ID here
  address: string;
  name: string;
  description: string;
  tokenType: string;
  interestRate: string;
  status: ProposalStatus;
  yesVotes: string;
  noVotes: string;
  totalVotes: string;
  deadline: Date;
  hasVoted: boolean;
  canFinalize: boolean;
  totalStakeCommitted: string;
  maximumTVL: string;
  minimumStakerBalance: string;
  poolQuorum: string;
  expirationDate: Date | null;
  stakers: StakerInfo[];
  lendingPoolAddress?: string;
  proposer: string;
}

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalAddress = params.id as string; // Get proposal address from URL
  const { wallets } = useWallets();
  const userWallet = wallets[0];


  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [userVotingPower, setUserVotingPower] = useState<string>("0"); // State for user's voting power
  const [canForceFinalize, setCanForceFinalize] = useState<boolean>(false); // State for force finalize eligibility

  // State for staking approval
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  // State for withdrawal
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [userStakeAmount, setUserStakeAmount] = useState<string>("0"); // Track user's specific stake

  useEffect(() => {
    if (provider && proposalAddress) {
      const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      loadProposalDetails();
    }
  }, [provider, proposalAddress, userWallet]); // Rerun if userWallet changes to update hasVoted

  // Calculate force finalize eligibility whenever proposal data or connection status changes
  useEffect(() => {
    if (proposal && userWallet) {
      const isProposer = userWallet === proposal.proposer.toLowerCase();
      const isActive = proposal.status === ProposalStatus.Active;
      const totalV = parseFloat(proposal.totalVotes);
      const yesV = parseFloat(proposal.yesVotes);
      const quorumPerc = parseFloat(proposal.poolQuorum);
      const meetsQuorum = totalV > 0 && quorumPerc > 0 && (yesV / totalV) * 100 >= quorumPerc;
      const isBeforeDeadline = proposal.deadline > new Date();

      const canActuallyForce = isProposer && isActive && meetsQuorum && isBeforeDeadline;
      setCanForceFinalize(canActuallyForce);
      console.log("Force Finalize Eligibility:", { isProposer, isActive, meetsQuorum, isBeforeDeadline, canForceFinalize: canActuallyForce });
    } else {
      // Reset if proposal is null or wallet disconnected
      setCanForceFinalize(false);
    }
  }, [proposal, userWallet]);

  // Check allowance whenever stake amount or proposal changes
  useEffect(() => {
    if (signer && proposal && stakeAmount && parseFloat(stakeAmount) > 0) {
        checkAllowance();
    } else {
        setNeedsApproval(false); // Reset if conditions aren't met
    }
  }, [signer, proposal, stakeAmount, userWallet]);

  // Find user's stake amount when proposal data loads
  useEffect(() => {
      if (proposal && userWallet) {
          const userStake = proposal.stakers.find(s => s.address.toLowerCase() === userWallet.toLowerCase());
          setUserStakeAmount(userStake ? userStake.amount : "0");
      } else {
          setUserStakeAmount("0");
      }
  }, [proposal, userWallet]);

  // Helper function to get the token name from address
  const getTokenName = (tokenAddress: string): string => {
    if (!tokenAddress) return "N/A";
    try {
      const checksumTokenAddress = ethers.getAddress(tokenAddress);
      const checksumMYRC = ethers.getAddress(MYRC_ADDRESS);
      const checksumUSDC = ethers.getAddress(USDC_ADDRESS);
      const checksumNITRO = ethers.getAddress(NITRO_ADDRESS);
      if (checksumTokenAddress === checksumMYRC) return "MYRC";
      if (checksumTokenAddress === checksumUSDC) return "USDC";
      if (checksumTokenAddress === checksumNITRO) return "NITRO";
      return `${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)}`;
    } catch (e) {
        console.error("Error getting checksum address:", e);
        return "Invalid Address";
    }
  };

  // Format address
  const formatAddress = (addr: string): string => {
    if (!addr) return "Unknown";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Load proposal details
  const loadProposalDetails = async () => {
    if (!provider || !proposalAddress) return;

    try {
      setIsLoading(true);
      setError("");
      setActionError("");
      setActionSuccess("");
      console.log("Loading details for proposal:", proposalAddress);

      const minimalProposalAbi = [
        "function name() view returns (string)",
        "function description() view returns (string)",
        "function tokenType() view returns (address)",
        "function interestRate() view returns (uint256)",
        "function maximumTVL() view returns (uint256)",
        "function proposer() view returns (address)",
        "function votingDeadline() view returns (uint256)",
        "function status() view returns (uint8)",
        "function poolQuorum() view returns (uint256)",
        "function expirationDate() view returns (uint256)",
        "function minimumStakerBalance() view returns (uint256)",
        "function totalVotes() view returns (uint256)",
        "function yesVotes() view returns (uint256)",
        "function noVotes() view returns (uint256)",
        "function totalStakeCommitted() view returns (uint256)",
        "function hasVoted(address) view returns (bool)",
        "function canFinalize() view returns (bool)",
        "function getStakers() view returns (address[], uint256[])",
        "function isPoolCreated() view returns (bool)",
        // Add DAO getter if needed
        "function dao() view returns (address)",
        // Add withdraw function
        "function withdrawStake() returns ()", 
      ];

      const proposalContract = new ethers.Contract(
        proposalAddress,
        minimalProposalAbi,
        provider
      );

      // Fetch all details in parallel
      const [
        _name, _description, _tokenType, _interestRate, _maximumTVL,
        _proposer, _votingDeadline, _status, _poolQuorum, _expirationDate,
        _minimumStakerBalance, _totalVotes, _yesVotes, _noVotes,
        _totalStakeCommitted, _canFinalize, _stakersData
      ] = await Promise.all([
        proposalContract.name().catch(() => "Unnamed Proposal"),
        proposalContract.description().catch(() => "No description available"),
        proposalContract.tokenType().catch(() => ethers.ZeroAddress),
        proposalContract.interestRate().catch(() => ethers.toBigInt(0)),
        proposalContract.maximumTVL().catch(() => ethers.toBigInt(0)),
        proposalContract.proposer().catch(() => ethers.ZeroAddress),
        proposalContract.votingDeadline().catch(() => ethers.toBigInt(0)),
        proposalContract.status().catch(() => 0),
        proposalContract.poolQuorum().catch(() => ethers.toBigInt(0)),
        proposalContract.expirationDate().catch(() => ethers.toBigInt(0)),
        proposalContract.minimumStakerBalance().catch(() => ethers.toBigInt(0)),
        proposalContract.totalVotes().catch(() => ethers.toBigInt(0)),
        proposalContract.yesVotes().catch(() => ethers.toBigInt(0)),
        proposalContract.noVotes().catch(() => ethers.toBigInt(0)),
        proposalContract.totalStakeCommitted().catch(() => ethers.toBigInt(0)),
        proposalContract.canFinalize().catch(() => false),
        proposalContract.getStakers().catch(() => [[], []]),
        proposalContract.isPoolCreated().catch(() => false),
        proposalContract.dao().catch(() => ethers.ZeroAddress), // Fetch DAO address
      ]);

      // Check if user has voted
      let _hasVoted = false;
      if (userWallet) {
        try {
          _hasVoted = await proposalContract.hasVoted(userWallet);
        } catch (err) {
          console.error("Error checking if user has voted:", err);
        }
      }

      // Fetch user's voting power (NITRO balance/votes)
      try {
        // Use a minimal ABI containing just balanceOf
        const minimalERC20Abi = [
          "function balanceOf(address owner) view returns (uint256)"
        ];
        const nitroContract = new ethers.Contract(NITRO_ADDRESS, minimalERC20Abi, provider);

        // Fetch balance directly
        const balance = await nitroContract.balanceOf(userWallet);
        console.log("User voting power (balanceOf):", balance.toString());

        setUserVotingPower(ethers.formatUnits(balance, 18)); // Assuming NITRO has 18 decimals
      } catch (err) {
        console.error("Error fetching user voting power (balanceOf):", err);
        setUserVotingPower("0"); // Set to 0 if fetching fails
      }

      // Process stakers data
      const stakers = _stakersData[0].map((addr: string, index: number) => ({
        address: addr,
        amount: ethers.formatUnits(_stakersData[1][index], 6) // Assuming USDC decimals
      }));

      // Convert dates
      const deadline = _votingDeadline.isZero() ? new Date() : new Date(_votingDeadline.toNumber() * 1000);
      const expirationDate = _expirationDate.isZero() ? null : new Date(_expirationDate.toNumber() * 1000);

      // Format numbers
      const tokenDecimals = getTokenName(_tokenType) === 'USDC' ? 6 : 18; 

      const proposalData: Proposal = {
        id: proposalAddress,
        address: proposalAddress,
        name: _name,
        description: _description,
        tokenType: _tokenType,
        interestRate: ethers.formatUnits(_interestRate, 0), // Interest rate is likely % (no decimals)
        status: _status,
        yesVotes: ethers.formatUnits(_yesVotes, 18), // Use 18 decimals for NITRO votes
        noVotes: ethers.formatUnits(_noVotes, 18), // Use 18 decimals for NITRO votes
        totalVotes: ethers.formatUnits(_totalVotes, 18), // Use 18 decimals for NITRO votes
        deadline: deadline,
        hasVoted: _hasVoted,
        canFinalize: _canFinalize,
        totalStakeCommitted: ethers.formatUnits(_totalStakeCommitted, tokenDecimals),
        maximumTVL: ethers.formatUnits(_maximumTVL, tokenDecimals),
        minimumStakerBalance: ethers.formatUnits(_minimumStakerBalance, tokenDecimals),
        poolQuorum: ethers.formatUnits(_poolQuorum, 0), // Quorum is likely %
        expirationDate,
        stakers,
        lendingPoolAddress: undefined, // Explicitly set to undefined as we can't get it here
        proposer: _proposer,
      };

      setProposal(proposalData);

    } catch (error: any) {
      console.error("Error loading proposal details:", error);
      setError(error.message || "Failed to load proposal details");
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on the proposal
  const voteOnProposal = async (support: boolean) => {
    if (!signer || !proposal) return;

    try {
      setIsVoting(true);
      setActionError("");
      setActionSuccess("");

      const proposalContract = new ethers.Contract(
        proposal.address,
        ["function vote(bool) returns ()"],
        signer
      );

      console.log("Voting on proposal:", proposal);

      console.log(`Voting ${support ? 'YES' : 'NO'} on proposal:`, proposal.id);
      const tx = await proposalContract.vote(support, { gasLimit: 150000 });
      console.log("Vote transaction sent:", tx.hash);
      setActionSuccess("Vote transaction submitted. Waiting for confirmation...");

      await tx.wait();
      console.log("Vote confirmed");
      setActionSuccess(`Successfully voted ${support ? 'YES' : 'NO'} on proposal ${proposal.name}`);

      // Reload proposal details to reflect the vote and updated status
      await loadProposalDetails();

    } catch (error: any) {
      console.error("Error voting on proposal:", error);
      setActionError(error.reason || error.message || "Failed to vote on proposal");
    } finally {
      setIsVoting(false);
    }
  };

  // Finalize the proposal
  const finalizeProposal = async () => {
    if (!signer || !proposal) return;

    try {
      setIsFinalizing(true);
      setActionError("");
      setActionSuccess("");

      const proposalContract = new ethers.Contract(
        proposal.address,
        ["function finalize() returns ()"],
        signer
      );

      console.log(`Finalizing proposal:`, proposal.id);
      const tx = await proposalContract.finalize({ gasLimit: 300000 }); // Finalization might need more gas
      console.log("Finalize transaction sent:", tx.hash);
      setActionSuccess("Finalize transaction submitted. Waiting for confirmation...");

      await tx.wait();
      console.log("Finalization confirmed");
      setActionSuccess(`Successfully finalized proposal ${proposal.name}`);

      // Reload proposal details
      await loadProposalDetails();

    } catch (error: any) {
      console.error("Error finalizing proposal:", error);
      setActionError(error.reason || error.message || "Failed to finalize proposal");
    } finally {
      setIsFinalizing(false);
    }
  };

  // Check token allowance for staking
  const checkAllowance = async () => {
      if (!signer || !proposal || !userWallet || !stakeAmount || parseFloat(stakeAmount) <= 0) {
          setNeedsApproval(false);
          return;
      }
      
      setIsCheckingAllowance(true);
      try {
          const tokenContract = new ethers.Contract(
              proposal.tokenType,
              ["function allowance(address owner, address spender) external view returns (uint256)",
               "function decimals() external view returns (uint8)"],
              signer
          );
          
          let tokenDecimals = 6;
          try { tokenDecimals = await tokenContract.decimals(); } catch { console.warn("Assuming 6 decimals")} 
          
          const allowance = await tokenContract.allowance(userWallet, proposal.address);
          const requiredAmount = ethers.parseUnits(stakeAmount, tokenDecimals);
          
          console.log(`Allowance check: Required=${requiredAmount}, Has=${allowance}`);
          setNeedsApproval(allowance.lt(requiredAmount));
          
      } catch (error) {
          console.error("Error checking allowance:", error);
          setNeedsApproval(true); // Assume approval needed if check fails
      } finally {
          setIsCheckingAllowance(false);
      }
  };

  // Approve token spending for staking
  const approveSpending = async () => {
      if (!signer || !proposal || !stakeAmount) return;
      
      setIsApproving(true);
      setActionError("");
      setActionSuccess("");
      try {
          const tokenContract = new ethers.Contract(
              proposal.tokenType,
              ["function approve(address spender, uint256 amount) external returns (bool)"],
              signer
          );
          
          console.log(`Approving proposal contract ${proposal.address} to spend tokens...`);
          setActionSuccess(`Approving ${getTokenName(proposal.tokenType)} spending...`);
          
          const approveTx = await tokenContract.approve(
              proposal.address,
              ethers.constants.MaxUint256, // Approve max
              { gasLimit: 100000 }
          );
          
          console.log("Approval transaction sent:", approveTx.hash);
          await approveTx.wait();
          console.log("Approval confirmed");
          setActionSuccess(`Successfully approved spending. You can now commit your stake.`);
          setNeedsApproval(false); // Update state after successful approval
          
      } catch (error: any) {
          console.error("Error approving tokens:", error);
          setActionError(error.reason || error.message || "Failed to approve tokens");
      } finally {
          setIsApproving(false);
      }
  };

  // Commit stake to the proposal
  const commitStake = async () => {
    if (!signer || !proposal || !stakeAmount || !userWallet || needsApproval) return;

    try {
      setIsStaking(true);
      setActionError("");
      setActionSuccess("");

      console.log(`Committing stake to proposal:`, proposal.id, "Amount:", stakeAmount);

      // Get the token contract
      const tokenContract = new ethers.Contract(
        proposal.tokenType,
        ["function approve(address spender, uint256 amount) external returns (bool)",
         "function allowance(address owner, address spender) external view returns (uint256)",
         "function decimals() external view returns (uint8)"],
        signer
      );

       // Get token decimals
       let tokenDecimals = 6; // Default to 6 for USDC-like
       try {
           tokenDecimals = await tokenContract.decimals();
       } catch (e) {
           console.warn("Could not fetch decimals for token, assuming 6.", e);
           if(getTokenName(proposal.tokenType) !== "USDC") {
               tokenDecimals = 18; // Assume 18 if not USDC and decimals call fails
               console.warn("Assuming 18 decimals for non-USDC token.");
           }
       }

      // Convert amount to wei
      const amount = ethers.parseUnits(stakeAmount, tokenDecimals);

      // Check current allowance
      const allowance = await tokenContract.allowance(userWallet, proposal.address);
      console.log("Current allowance:", ethers.formatUnits(allowance, tokenDecimals));

      // Approve if necessary
      if (allowance.lt(amount)) {
        console.log("Approving tokens before staking...");
        setActionSuccess(`Approving ${stakeAmount} ${getTokenName(proposal.tokenType)} tokens...`);
        const approveTx = await tokenContract.approve(
            proposal.address,
            ethers.constants.MaxUint256, // Approve max to avoid future approvals
            { gasLimit: 100000 }
        );
        console.log("Approval transaction sent:", approveTx.hash);
        await approveTx.wait();
        console.log("Approval confirmed");
        setActionSuccess(`Token approval confirmed. Now staking...`);
      }

      // Now commit the stake
      const proposalContract = new ethers.Contract(
        proposal.address,
        ["function commitStake(uint256) returns ()"],
        signer
      );

      console.log("Committing stake...");
      const tx = await proposalContract.commitStake(amount, { gasLimit: 500000 });
      console.log("Stake transaction sent:", tx.hash);
      setActionSuccess("Stake transaction submitted. Waiting for confirmation...");

      await tx.wait();
      console.log("Stake confirmed");

      setActionSuccess(`Successfully committed ${stakeAmount} ${getTokenName(proposal.tokenType)} to proposal ${proposal.name}`);
      setStakeAmount("");

      // Reload proposal details
      await loadProposalDetails();

    } catch (error: any) {
      console.error("Error committing stake:", error);
       let errorMessage = error.reason || error.message || "Failed to commit stake";
       if (error.code === "CALL_EXCEPTION") {
           errorMessage = "Transaction failed. Possible reasons: insufficient balance, max TVL reached, stake exceeds limit, or pool expired.";
       }
      setActionError(errorMessage);
    } finally {
      setIsStaking(false);
    }
  };

  // Withdraw stake if proposal is rejected
  const withdrawStake = async () => {
    if (!signer || !proposal || proposal.status !== ProposalStatus.Rejected) return;

    setIsWithdrawing(true);
    setActionError("");
    setActionSuccess("");
    try {
      const proposalContract = new ethers.Contract(
        proposal.address,
        ["function withdrawStake() returns ()"], // Use the updated ABI part
        signer
      );

      console.log(`Withdrawing stake from rejected proposal:`, proposal.id);
      const tx = await proposalContract.withdrawStake({ gasLimit: 150000 });
      console.log("Withdrawal transaction sent:", tx.hash);
      setActionSuccess("Withdrawal submitted. Waiting for confirmation...");

      await tx.wait();
      console.log("Withdrawal confirmed");
      setActionSuccess(`Successfully withdrew your stake from proposal ${proposal.name}`);

      // Reload proposal details to reflect the withdrawal
      await loadProposalDetails();

    } catch (error: any) {
      console.error("Error withdrawing stake:", error);
      setActionError(error.reason || error.message || "Failed to withdraw stake");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Get status text
  const getStatusText = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active: return "Active";
      case ProposalStatus.Approved: return "Approved";
      case ProposalStatus.Rejected: return "Rejected";
      case ProposalStatus.Executed: return "Executed";
      default: return "Unknown";
    }
  };

  // Get status color
  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case ProposalStatus.Approved: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case ProposalStatus.Rejected: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case ProposalStatus.Executed: return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Format date
  const formatDate = (date: Date | null) => {
    return date ? new Date(date).toLocaleString() : "N/A";
  };

  // Calculate voting percentage
  const calculateVotePercentage = (votes: string, totalVotes: string) => {
    const total = parseFloat(totalVotes);
    if (total === 0) return 0;
    return (parseFloat(votes) / total) * 100;
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading proposal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
        <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>
         <Link href={`/dao`} className="text-blue-500 hover:text-blue-600">
           Go back to DAO
        </Link>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Proposal not found.</p>
         <Link href={`/dao`} className="text-blue-500 hover:text-blue-600">
           Go back to DAO
        </Link>
      </div>
    );
  }

  const tokenName = getTokenName(proposal.tokenType);
  const yesPerc = calculateVotePercentage(proposal.yesVotes, proposal.totalVotes);
  const noPerc = calculateVotePercentage(proposal.noVotes, proposal.totalVotes);
  const stakePerc = parseFloat(proposal.maximumTVL) > 0
    ? Math.min(100, (parseFloat(proposal.totalStakeCommitted) / parseFloat(proposal.maximumTVL)) * 100)
    : 0;


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href={`/dao`} // Link back to the main DAO page
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to DAO
        </Link>

        {/* Proposal Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{proposal.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
              {getStatusText(proposal.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Proposal Address: {proposal.address}
          </p>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Proposed by: {formatAddress(proposal.proposer)}
          </p>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{proposal.description}</p>
        </div>

         {/* Action Messages */}
        {actionSuccess && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded">
            <p className="text-sm text-green-800 dark:text-green-200">{actionSuccess}</p>
          </div>
        )}
        {actionError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded">
            <p className="text-sm text-red-800 dark:text-red-200">{actionError}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Voting & Staking Actions */}
          <div className="space-y-6">
            {/* Voting Section */}
            {proposal.status === ProposalStatus.Active && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Vote</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Voting Deadline: {formatDate(proposal.deadline)}
                 </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                  Anyone holding NITRO governance tokens can vote on this proposal. Each voter has the same voting power.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Your voting power: {parseFloat(userVotingPower) > 0 ? "✅ You can vote" : "❌ No governance tokens"}
                </p>
                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => voteOnProposal(true)}
                    disabled={isVoting || proposal.hasVoted || parseFloat(userVotingPower) <= 0}
                  >
                    {isVoting ? "Voting..." : "Vote YES"}
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => voteOnProposal(false)}
                    disabled={isVoting || proposal.hasVoted || parseFloat(userVotingPower) <= 0}
                  >
                    {isVoting ? "Voting..." : "Vote NO"}
                  </button>
                </div>
                { proposal.hasVoted && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-3 text-center">
                    You have already voted on this proposal.
                  </p>
                )}
                {!proposal.hasVoted && parseFloat(userVotingPower) <= 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 text-center">
                    You need NITRO governance tokens to vote. Get some tokens to participate in voting.
                  </p>
                )}
              </div>
            )}

            {/* Staking Section */}
            {proposal.status === ProposalStatus.Active && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Commit Stake</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Stake {tokenName} to participate in the pool if approved. Pool expires: {formatDate(proposal.expirationDate)}
                 </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="number"
                    placeholder={`Amount in ${tokenName}`}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-white"
                    disabled={isStaking}
                  />
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={commitStake}
                    disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0 || needsApproval || isCheckingAllowance}
                  >
                    {isCheckingAllowance ? "Checking..." : isStaking ? "Staking..." : "Commit Stake"}
                  </button>
                </div>

                {/* Show Approve button if needed */}
                {needsApproval && !isCheckingAllowance && (
                 <button
                   className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                   onClick={approveSpending}
                   disabled={isApproving || !stakeAmount || parseFloat(stakeAmount) <= 0}
                 >
                   {isApproving ? "Approving..." : `Approve ${getTokenName(proposal.tokenType)} Spending`}
                 </button>
                )}
              </div>
            )}

             {/* Finalize Section */}
             {proposal.status === ProposalStatus.Active && proposal.canFinalize && (
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Finalize Proposal</h2>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                         The voting period has ended or conditions met. This proposal can now be finalized.
                     </p>
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={finalizeProposal}
                        disabled={isFinalizing}
                    >
                        {isFinalizing ? "Finalizing..." : "Finalize Proposal"}
                    </button>
                 </div>
             )}

             {/* Force Finalize Section (Visible only to proposer before deadline if quorum met) */}
             {canForceFinalize && (
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-yellow-400">
                     <h2 className="text-xl font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Force Finalize (Creator Only)</h2>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                         The proposal meets the required 'Yes' vote quorum. As the proposer, you can finalize it now before the deadline.
                     </p>
                     <button
                         className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                         onClick={finalizeProposal} // Calls the same finalize function
                         disabled={isFinalizing}
                     >
                         {isFinalizing ? "Finalizing..." : "Force Finalize Proposal"}
                     </button>
                 </div>
             )}

          </div>

          {/* Right Column: Details & Status */}
          <div className="space-y-6">
            {/* Voting Results */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Voting Results</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Votes: {proposal.totalVotes}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-1 relative overflow-hidden">
                 <div
                    className="bg-green-500 h-full absolute left-0 top-0"
                    style={{ width: `${yesPerc}%` }}
                  ></div>
                  <div
                      className="bg-red-500 h-full absolute right-0 top-0"
                      style={{ width: `${noPerc}%` }}
                  ></div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-green-600 dark:text-green-400">Yes: {proposal.yesVotes} ({yesPerc.toFixed(1)}%)</span>
                <span className="text-red-600 dark:text-red-400">No: {proposal.noVotes} ({noPerc.toFixed(1)}%)</span>
              </div>
            </div>

            {/* Pool Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Pool Status</h2>
              <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">Token:</p><p className="font-medium text-right">{tokenName}</p>
                    <p className="text-gray-500 dark:text-gray-400">Interest Rate:</p><p className="font-medium text-right">{proposal.interestRate}%</p>
                    <p className="text-gray-500 dark:text-gray-400">Min Staker Balance:</p><p className="font-medium text-right">{proposal.minimumStakerBalance} {tokenName}</p>
                    <p className="text-gray-500 dark:text-gray-400">Pool Quorum:</p><p className="font-medium text-right">{proposal.poolQuorum}%</p>
                    <p className="text-gray-500 dark:text-gray-400">Expiration:</p><p className="font-medium text-right">{formatDate(proposal.expirationDate)}</p>
                  </div>
                  <div className="pt-3">
                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pool Funding Progress</p>
                      {/* Progress towards Maximum TVL */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Towards Maximum ({proposal.maximumTVL} {tokenName})</p>
                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                         <div
                           className="bg-blue-500 h-2.5 rounded-full"
                           style={{ width: `${stakePerc}%` }}
                         ></div>
                       </div>
                   </div>
               </div>
             </div>

            {/* Stakers List */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Stakers ({proposal.stakers.length})</h2>
              {proposal.stakers.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                        <th className="text-left pb-2 font-medium">Address</th>
                        <th className="text-right pb-2 font-medium">Amount ({tokenName})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.stakers.map((staker, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-2 truncate" title={staker.address}>{formatAddress(staker.address)}</td>
                          <td className="py-2 text-right">{staker.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No stakers yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
