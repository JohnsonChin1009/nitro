"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";

// Import ABIs
import DAOImplementationABI from "@/contract-artifacts/DAOImplementation.json"
import MOCKUSDCABI from "@/contract-artifacts/MockUSDC.json";
import GovernanceTokenABI from "@/contract-artifacts/GovernanceToken.json";
import { MYRC_ContractAddress } from "@/lib/contractAddress";
import { USDC_ContractAddress } from "@/lib/contractAddress";
import { DAOImplementation_ContractAddress } from "@/lib/contractAddress";
import { useWallets } from "@privy-io/react-auth";
import { GovernanceToken_ContractAddress } from "@/lib/contractAddress";


enum ProposalStatus {
  Active = 0,
  Approved = 1,
  Rejected = 2,
  Executed = 3
}

enum ViewMode {
  Summary,
  Details,
  Pool
}

interface Proposal {
  id: number;
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
  stakers: {address: string, amount: string}[];
  lendingPoolAddress?: string; // New field to store lending pool address
}

export default function GovernanceSection() {
  // Update this to your newly deployed DAO contract address
  const address = DAOImplementation_ContractAddress;
  const router = useRouter();
  const { wallets } = useWallets();
  const userWallet = wallets[0];
  
  if (!userWallet) {
    throw new Error("No wallet found");
  }

  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();

  // State for DAO details
  const [daoName, setDaoName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // State for proposals
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [actionError, setActionError] = useState<string>("");
  const [autoFinalizing, setAutoFinalizing] = useState<boolean>(false);
  
  
  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Summary);
  
  // State for token faucet
  const [isGettingTokens, setIsGettingTokens] = useState<boolean>(false);
  const [tokenSuccess, setTokenSuccess] = useState<string>("");
  const [tokenError, setTokenError] = useState<string>("");

    
  // Finalize a proposal
  const finalizeProposal = async (proposalId: number) => {
    if (!signer) return;
    
    // Get the proposal from the proposals array
    const proposal = proposals[proposalId];
    if (!proposal) {
      console.error(`Proposal with ID ${proposalId} not found`);
      return;
    }
    
    try {
      setIsFinalizing(true);
      setActionError("");
      setActionSuccess("");
      
      // Create a minimal abi for the proposal finalize function
      const minimalProposalAbi = [
        "function finalize() returns ()"
      ];
      
      const proposalContract = new ethers.Contract(
        proposal.address,
        minimalProposalAbi,
        signer
      );
      
      console.log(`Finalizing proposal:`, proposal.id);
      
      const tx = await proposalContract.finalize();
      console.log("Finalize transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Finalization confirmed");
      
      setActionSuccess(`Successfully finalized proposal ${proposal.name}`);
      
      // Reload DAO details
      await loadDAODetails();
      
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error finalizing proposal:", error);
            setActionError(error.message || "Failed to finalize proposal");
        } else {
            console.error("Unknown error:", error);
            setError("An unknown error occurred");
        }
    } finally {
      setIsFinalizing(false);
    }
  };

  const loadDAODetails = useCallback(async () => {
    if (!provider) return;
    
    try {
      setIsLoading(true);
      setError("");
      console.log("Loading DAO details for:", address);
      
      const daoContract = new ethers.Contract(
        address as string,
        DAOImplementationABI,
        provider
      );
      
      // Get DAO name
      const name = await daoContract.name();
      setDaoName(name);
      
      // Get DAO voting period for debugging
      try {
        const daoVotingPeriodSeconds = await daoContract.votingPeriod();
        const daoVotingPeriodDays = daoVotingPeriodSeconds.toNumber() / (60 * 60 * 24);
        console.log(`DAO Voting Period: ${daoVotingPeriodSeconds.toString()} seconds (${daoVotingPeriodDays} days)`);
      } catch (e: unknown) {
        console.error("Could not read votingPeriod from DAO contract. Does the function exist?", e);
      }
      
      // Get proposal count
      const proposalCount = await daoContract.proposalCount();
      console.log("Total proposals:", proposalCount.toString());
      
      const proposalsData: Proposal[] = [];
      const proposalsToFinalize: number[] = [];
      
      // Loop through all proposals
      for (let i = 0; i < proposalCount; i++) {
        try {
          const proposalAddress = await daoContract.proposals(i);
          console.log(`Proposal ${i} address:, proposalAddress`);
          
          // Create a minimal abi for the proposal properties we need
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
            "function vote(bool) returns ()",
            "function commitStake(uint256) returns ()",
            "function finalize() returns ()",
            "function isPoolCreated() view returns (bool)"
          ];
          
          const proposalContract = new ethers.Contract(
            proposalAddress,
            minimalProposalAbi,
            provider
          );
          
          // Get proposal details directly from contract properties
          try {
            // Access all properties with try/catch for each to handle missing properties gracefully
            let _name = "Unnamed Proposal";
            let _description = "No description available";
            let _tokenType = ethers.ZeroAddress;
            let _interestRate = ethers.toBigInt(0);
            let _maximumTVL = ethers.toBigInt(0);
            let _votingDeadline = ethers.toBigInt(0);
            let _status = 0;
            let _poolQuorum = ethers.toBigInt(0);
            let _expirationDate = ethers.toBigInt(0);
            let _minimumStakerBalance = ethers.toBigInt(0);
            let _totalVotes = ethers.toBigInt(0);
            let _yesVotes = ethers.toBigInt(0);
            let _noVotes = ethers.toBigInt(0);
            let _totalStakeCommitted = ethers.toBigInt(0);
            
            try { _name = await proposalContract.name(); } catch (e) { console.error("Error getting proposal name:", e); }
            try { _description = await proposalContract.description(); } catch (e) { console.error("Error getting proposal description:", e); }
            try { _tokenType = await proposalContract.tokenType(); } catch (e) { console.error("Error getting proposal tokenType:", e); }
            try { _interestRate = await proposalContract.interestRate(); } catch (e) { console.error("Error getting proposal interestRate:", e); }
            try { _maximumTVL = await proposalContract.maximumTVL(); } catch (e) { console.error("Error getting proposal maximumTVL:", e); }
            try { _votingDeadline = await proposalContract.votingDeadline(); } catch (e) { console.error("Error getting proposal votingDeadline:", e); }
            try { _status = await proposalContract.status(); } catch (e) { console.error("Error getting proposal status:", e); }
            try { _poolQuorum = await proposalContract.poolQuorum(); } catch (e) { console.error("Error getting proposal poolQuorum:", e); }
            try { _expirationDate = await proposalContract.expirationDate(); } catch (e) { console.error("Error getting proposal expirationDate:", e); }
            try { _minimumStakerBalance = await proposalContract.minimumStakerBalance(); } catch (e) { console.error("Error getting proposal minimumStakerBalance:", e); }
            try { _totalVotes = await proposalContract.totalVotes(); } catch (e) { console.error("Error getting proposal totalVotes:", e); }
            try { _yesVotes = await proposalContract.yesVotes(); } catch (e) { console.error("Error getting proposal yesVotes:", e); }
            try { _noVotes = await proposalContract.noVotes(); } catch (e) { console.error("Error getting proposal noVotes:", e); }
            try { _totalStakeCommitted = await proposalContract.totalStakeCommitted(); } catch (e) { console.error("Error getting proposal totalStakeCommitted:", e); }
            
            // Get stakers information
            let stakers: {address: string, amount: string}[] = [];
            try {
              const stakersData = await proposalContract.getStakers();
              stakers = stakersData[0].map((addr: string, index: number) => ({
                address: addr,
                amount: ethers.formatUnits(stakersData[1][index], 6) // Assuming USDC decimals
              }));
            } catch (err) {
              console.error("Error getting stakers:", err);
            }
            
            // Check if user has voted (if connected)
            let hasVoted = false;
            if (userWallet) {
              try {
                hasVoted = await proposalContract.hasVoted(userWallet);
              } catch (err) {
                console.error("Error checking if user has voted:", err);
              }
            }
            
            // Get lending pool address if the proposal is approved or executed
            let lendingPoolAddress;
            try {
              let isPoolCreated = false;
              try {
                isPoolCreated = await proposalContract.isPoolCreated();
              } catch (err) {
                console.error("Error checking if pool is created:", err);
              }
              
              // If the pool is created, we need to find its address
              // In a real app, you would track this in your backend or listen for LendingPoolCreated events
              // For this demo, we'll use a placeholder
              if (isPoolCreated && (_status === ProposalStatus.Approved || _status === ProposalStatus.Executed)) {
                // In a real implementation, you'd get this from events or a mapping
                lendingPoolAddress = `0x${proposalAddress.substring(2, 10)}Pool`;
              }
            } catch (err) {
              console.error("Error getting lending pool address:", err);
            }
            
            // Check if proposal can be finalized and auto-finalize if user has signer
            let canFinalize = false;
            try {
              canFinalize = await proposalContract.canFinalize();
              if (canFinalize && _status === ProposalStatus.Active && signer) {
                proposalsToFinalize.push(i);
              }
            } catch (err) {
              console.error("Error checking if proposal can be finalized:", err);
            }
            
            // Convert expiration date if available
            let expirationDate = null;
            try {
              if (_expirationDate && _expirationDate != BigInt(0)) {
                expirationDate = new Date(Number(_expirationDate) * 1000);
              }
            } catch (err) {
              console.error("Error parsing expiration date:", err);
            }
            
            // Convert voting deadline
            let deadline = new Date();
            try {
              if (_votingDeadline && _votingDeadline != BigInt(0)) {
                deadline = new Date(Number(_votingDeadline) * 1000);
              }
            } catch (err) {
              console.error("Error parsing voting deadline:", err);
            }
            
            const proposal: Proposal = {
              id: i,
              address: proposalAddress,
              name: _name,
              description: _description,
              tokenType: _tokenType,
              interestRate: ethers.formatUnits(_interestRate, 0),
              status: _status,
              yesVotes: ethers.formatUnits(_yesVotes, 0),
              noVotes: ethers.formatUnits(_noVotes, 0),
              totalVotes: ethers.formatUnits(_totalVotes, 0),
              deadline: deadline,
              hasVoted,
              canFinalize,
              totalStakeCommitted: ethers.formatUnits(_totalStakeCommitted, 6), // USDC has 6 decimals
              maximumTVL: ethers.formatUnits(_maximumTVL, 6),
              minimumStakerBalance: ethers.formatUnits(_minimumStakerBalance, 6),
              poolQuorum: ethers.formatUnits(_poolQuorum, 0),
              expirationDate,
              stakers,
              lendingPoolAddress // Add the lending pool address if available
            };
            
            proposalsData.push(proposal);
          } catch (detailsError) {
            console.error(`Error getting proposal details for ${i}:, ${detailsError}`);
          }
        } catch (error: unknown) {
          console.error("Error loading proposal: ", error);
        }
      }
      
      setProposals(proposalsData);
      setIsLoading(false);
      
      // Auto-finalize proposals that are ready
      if (proposalsToFinalize.length > 0 && signer) {
        setAutoFinalizing(true);
        for (const id of proposalsToFinalize) {
          try {
            const proposal = proposalsData[id];
            console.log(`Auto-finalizing proposal ${id}: ${proposal.name}`);
            await finalizeProposal(id);
          } catch (error: unknown) {
            console.error("Error auto-finalizing proposal", error);
          }
        }
        setAutoFinalizing(false);
      }
      
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error loading DAO details:", error);
            setTokenError(error.message || "Failed to get tokens");
        } else {
            console.error("Unknown error:", error);
            setError("An unknown error occurred");
        }
      setIsLoading(false);
      setAutoFinalizing(false);
    }
  }, [provider, userWallet, signer, address, finalizeProposal]);

    useEffect(() => {
        const loadDAOData = async () => {
                const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
                const signer = await provider.getSigner();
                setProvider(provider);
                setSigner(signer);
        }
        loadDAOData();
    }, []);

  // Helper function to get the token name from address
  const getTokenName = (tokenAddress: string): string => {
    // Apply checksum to both addresses for comparison
    const checksumTokenAddress = ethers.getAddress(tokenAddress);
    const checksumNITRO = ethers.getAddress(GovernanceToken_ContractAddress);
    const checksumMYRC = ethers.getAddress(MYRC_ContractAddress);
    const checksumUSDC = ethers.getAddress(USDC_ContractAddress);
    
    if (checksumTokenAddress === checksumNITRO) {
      return "NITRO";
    } else if (checksumTokenAddress === checksumMYRC) {
      return "MYRC";
    } else if (checksumTokenAddress === checksumUSDC) {
      return "USDC";
    } else {
      // Return shortened address for other tokens
      return `${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)}`;
    }
  };

  
  // Commit stake to a proposal
  const commitStake = async () => {
    if (!signer || !selectedProposal || !stakeAmount || !userWallet) return;
    
    try {
      setIsStaking(true);
      setActionError("");
      setActionSuccess("");
      
      console.log(`Committing stake to proposal:`, selectedProposal.id, "Amount:", stakeAmount);
      
      // Get the token contract
      const tokenContract = new ethers.Contract(
        selectedProposal.tokenType,
        ["function approve(address spender, uint256 amount) external returns (bool)",
         "function allowance(address owner, address spender) external view returns (uint256)",
         "function balanceOf(address owner) external view returns (uint256)"],
        signer
      );
      
      // Create a contract for the proposal
      const proposalContract = new ethers.Contract(
        selectedProposal.address,
        ["function commitStake(uint256) returns ()"],
        signer
      );
      
      // Convert amount to wei - assuming USDC with 6 decimals
      const decimals = selectedProposal.tokenType === USDC_ContractAddress ? 6 : 18;
      const amount = ethers.parseUnits(stakeAmount, decimals);
      
      // Check token balance first
      const balance = await tokenContract.balanceOf(userWallet);
      console.log("User token balance:", ethers.formatUnits(balance, decimals));
      
      if (balance.lt(amount)) {
        throw new Error(`Insufficient ${getTokenName(selectedProposal.tokenType)} balance. You need ${stakeAmount} tokens.`);
      }
      
      // Check current allowance
      const allowance = await tokenContract.allowance(userWallet, selectedProposal.address);
      console.log("Current allowance:", ethers.formatUnits(allowance, decimals));
      
      // If allowance is insufficient, approve tokens first
      if (allowance.lt(amount)) {
        console.log("Approving tokens before staking...");
        setActionSuccess(`Approving ${stakeAmount} tokens for staking...`);
        
        const approveTx = await tokenContract.approve(
          selectedProposal.address, 
          ethers.MaxUint256, // Approve for maximum amount to avoid future approvals
          { gasLimit: 100000 }
        );
        
        console.log("Approval transaction sent:", approveTx.hash);
        await approveTx.wait();
        console.log("Approval confirmed");
        
        setActionSuccess(`Token approval confirmed. Now staking...`);
      }
      
      // Now commit the stake
      console.log("Committing stake...");
      const tx = await proposalContract.commitStake(amount, {
        gasLimit: 500000 // Increase gas limit for this function
      });
      console.log("Stake transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Stake confirmed");
      
      setActionSuccess(`Successfully committed ${stakeAmount} tokens to proposal ${selectedProposal.name}`);
      setStakeAmount("");
      
      // Reload DAO details
      await loadDAODetails();
      
    } catch (error: unknown) {
        if (error instanceof Error) {
            let errorMessage = "Failed to commit stake";
            console.error("Error committing stake:", error);
            if (error.cause === "CALL_EXCEPTION") {
              errorMessage = "Transaction reverted by the contract. This could be because:";
              errorMessage += "\n- You don't have enough tokens";
              errorMessage += "\n- The maximum TVL has been reached";
              errorMessage += "\n- Your stake exceeds 15% of maximum TVL";
            } else if (error.message) {
              errorMessage = error.message;
            }
            setActionError(errorMessage);
        } else {
            console.error("Unknown error:", error);
        }
      
      
    } finally {
      setIsStaking(false);
    }
  };
  
  // Get status text
  const getStatusText = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active:
        return "Active";
      case ProposalStatus.Approved:
        return "Approved";
      case ProposalStatus.Rejected:
        return "Rejected";
      case ProposalStatus.Executed:
        return "Executed";
      default:
        return "Unknown";
    }
  };
  
  // Get status color
  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case ProposalStatus.Approved:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case ProposalStatus.Rejected:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case ProposalStatus.Executed:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  // Calculate voting percentage
  const calculateVotePercentage = (votes: string, totalVotes: string) => {
    if (parseFloat(totalVotes) === 0) return 0;
    return (parseFloat(votes) / parseFloat(totalVotes)) * 100;
  };

  // Navigate to proposal detail page
  const viewProposalDetails = (proposalId: number) => {
    router.push(`/dao/proposal/${proposals[proposalId].address}`);
  };
  
  // Request tokens from faucet
  const requestTokens = async (isGovernanceToken = true) => {
    if (!signer || !userWallet) return;
    
    try {
      setIsGettingTokens(true);
      setTokenError("");
      setTokenSuccess("");
      
      // Determine which token to mint
      const tokenAddress = isGovernanceToken ? GovernanceToken_ContractAddress : USDC_ContractAddress;
      const tokenName = isGovernanceToken ? "NITRO" : "USDC";
      const tokenAbi = isGovernanceToken ? GovernanceTokenABI : MOCKUSDCABI;

      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        signer
      );
      
      console.log(`Requesting ${tokenName} tokens from faucet...`);

      const tx1 = await tokenContract.faucet();
      console.log("faucet transaction:", tx1.hash);
      await tx1.wait();
      console.log("Tokens received!");
      
      setTokenSuccess(`Successfully received 1000 ${tokenName} tokens! Now you can vote or stake.`);
      
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error getting tokens from faucet:", error);
            setTokenError(error.message || "Failed to get tokens");
        } else {
            console.error("Unknown error:", error);
            setError("An unknown error occurred");
        }
    } finally {
      setIsGettingTokens(false);
    }
  };
  
  // Get NITRO tokens
  const getNitroTokens = () => requestTokens(true);
  
  // Get USDC tokens
  const getUSDCTokens = () => requestTokens(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
        {/* Create Proposal Button */}
        <Link
        href={`/dao/create-proposal`}
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition mb-8"
        >
        Create New Proposal
        </Link>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
                     
              
          <Link 
            href="/" 
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to DAOs
          </Link>
          
          <div className="flex items-center gap-2">
            {autoFinalizing && (
              <div className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                Auto-finalizing proposals...
              </div>
            )}
            
            <button
              onClick={loadDAODetails}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {/* DAO Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading DAO details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <button
                onClick={loadDAODetails}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">{daoName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Contract: {address as string}
              </p>
              
              {/* Test Tokens Section */}
              {userWallet && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Get Test Tokens</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    For testing purposes, you can get tokens to interact with the DAO.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => getNitroTokens()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition"
                      disabled={isGettingTokens}
                    >
                      {isGettingTokens ? "Getting Tokens..." : "Get NITRO (Governance)"}
                    </button>
                    <button
                      onClick={() => getUSDCTokens()}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition"
                      disabled={isGettingTokens}
                    >
                      {isGettingTokens ? "Getting Tokens..." : "Get USDC (Staking)"}
                    </button>
                  </div>
                  {tokenSuccess && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      {tokenSuccess}
                    </p>
                  )}
                  {tokenError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {tokenError}
                    </p>
                  )}
                </div>
              )}
              
              {/* Proposals */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Proposals</h2>
                
                {proposals.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
                    No proposals found in this DAO.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {proposals.map((proposal, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{proposal.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ID: #{proposal.id}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                            {getStatusText(proposal.status)}
                          </span>
                        </div>
                        
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                          {proposal.description.length > 150 ? 
                            `${proposal.description.substring(0, 150)}...` : 
                            proposal.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Token: {getTokenName(proposal.tokenType)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Interest Rate: {proposal.interestRate}%
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              TVL: {proposal.totalStakeCommitted}/{proposal.maximumTVL} {getTokenName(proposal.tokenType)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Votes: {proposal.yesVotes}/{proposal.totalVotes} ({calculateVotePercentage(proposal.yesVotes, proposal.totalVotes).toFixed(2)}%)
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Deadline: {formatDate(proposal.deadline)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {proposal.hasVoted ? "You have voted" : "You have not voted"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div>
                            <button
                              onClick={() => viewProposalDetails(proposal.id)}
                              className="text-blue-500 hover:text-blue-600 px-3 py-1 text-sm rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Action Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">{selectedProposal.name}</h2>
              
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
              
              {viewMode === ViewMode.Pool && (
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                    <h3 className="font-medium mb-3">Pool Details</h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pool Status</p>
                          <p className="font-medium">
                            {selectedProposal.status === ProposalStatus.Active ? "Active" : 
                             selectedProposal.status === ProposalStatus.Approved ? "Approved" :
                             selectedProposal.status === ProposalStatus.Rejected ? "Rejected" : "Executed"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Token Type</p>
                          <p className="font-medium">{getTokenName(selectedProposal.tokenType)}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Minimum Stake Balance</p>
                          <p className="font-medium">{selectedProposal.minimumStakerBalance} USDC</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Interest Rate</p>
                          <p className="font-medium">{selectedProposal.interestRate}%</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pool Quorum</p>
                          <p className="font-medium">{selectedProposal.poolQuorum}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expiration Date</p>
                          <p className="font-medium">{selectedProposal.expirationDate ? formatDate(selectedProposal.expirationDate) : "N/A"}</p>
                        </div>
                      </div>
                      
                      {/* Pool Progress */}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pool Progress</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, (parseFloat(selectedProposal.totalStakeCommitted) / parseFloat(selectedProposal.maximumTVL)) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Current: {selectedProposal.totalStakeCommitted} USDC</span>
                          <span>Max: {selectedProposal.maximumTVL} USDC</span>
                        </div>
                      </div>
                      
                      {/* Stakers List */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Stakers ({selectedProposal.stakers.length})</h4>
                        {selectedProposal.stakers.length > 0 ? (
                          <div className="max-h-40 overflow-y-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-gray-500 dark:text-gray-400">
                                  <th className="text-left pb-2">Address</th>
                                  <th className="text-right pb-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedProposal.stakers.map((staker, index) => (
                                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                                    <td className="py-2 truncate" style={{ maxWidth: "180px" }}>{staker.address}</td>
                                    <td className="py-2 text-right">{staker.amount} USDC</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No stakers yet</p>
                        )}
                      </div>
                      
                      {/* Commit Stake button visible in pool view if proposal is active */}
                      {selectedProposal.status === ProposalStatus.Active && (
                        <div className="pt-2">
                          <button
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition"
                            onClick={() => setViewMode(ViewMode.Details)}
                          >
                            Commit Stake
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {viewMode === ViewMode.Details && (
                <div className="space-y-4">
                  
                  {/* Stake Section */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                    <h3 className="font-medium mb-2">Commit Stake</h3>
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        placeholder="Amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        disabled={selectedProposal.status !== ProposalStatus.Active}
                      />
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition disabled:opacity-50"
                        onClick={() => commitStake()}
                        disabled={isStaking || !stakeAmount || selectedProposal.status !== ProposalStatus.Active}
                      >
                        {isStaking ? "Committing Stake..." : "Commit Stake"}
                      </button>
                    </div>
                  </div>
                  
                  {/* Pool Details Summary */}
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                    <h3 className="font-medium mb-2">Pool Status</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current Pool:</span>
                      <span className="font-medium">{selectedProposal.totalStakeCommitted} / {selectedProposal.maximumTVL} USDC</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (parseFloat(selectedProposal.totalStakeCommitted) / parseFloat(selectedProposal.maximumTVL)) * 100)}%` }}
                      ></div>
                    </div>
                    <button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-sm transition"
                      onClick={() => setViewMode(ViewMode.Pool)}
                    >
                      View Full Pool Details
                    </button>
                  </div>
                  
                  {/* Finalize Section */}
                  {selectedProposal.canFinalize && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                      <h3 className="font-medium mb-2">Finalize Proposal</h3>
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-50"
                        onClick={() => finalizeProposal(selectedProposal.id)}
                        disabled={isFinalizing || selectedProposal.status !== ProposalStatus.Active}
                      >
                        {isFinalizing ? "Finalizing..." : "Finalize Proposal"}
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This proposal is ready to be finalized!
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <button
                className="mt-6 w-full text-gray-600 dark:text-gray-300 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => {
                  setSelectedProposal(null);
                  setActionSuccess("");
                  setActionError("");
                  setViewMode(ViewMode.Summary);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 