"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import { useWallet } from "../../contexts/WalletContext";

// Import ABIs
import DAOImplementationABI from "../../abis/DAOImplementation.json";
import MockUSDCAbi from "../../abis/MockUSDC.json";

export default function CreateProposalPage() {
  // Hardcode the DAO address instead of trying to get it from params
  const daoAddress = "0xf912F9472B18De307D1770acc54105d728178836";
  const router = useRouter();
  const { signer, provider, isConnected } = useWallet();
  
  // State for DAO details
  const [daoName, setDaoName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // State for proposal creation
  const [proposalName, setProposalName] = useState<string>("");
  const [proposalDescription, setProposalDescription] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("5");
  const [minimumStakerBalance, setMinimumStakerBalance] = useState<string>("100");
  const [maximumTVL, setMaximumTVL] = useState<string>("1000000");
  const [proposalQuorum, setProposalQuorum] = useState<string>("51");
  const [closingDays, setClosingDays] = useState<string>("30");
  const [tokenType, setTokenType] = useState<string>("");
  
  // State for creation process
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [creationSuccess, setCreationSuccess] = useState<string>("");
  const [creationError, setCreationError] = useState<string>("");
  
  // Contract addresses - Apply checksum to all addresses
  const USDC_ADDRESS = ethers.utils.getAddress("0x824Ec7410B298599956CcBE90e448862E9514012");
  const MYRC_ADDRESS = ethers.utils.getAddress("0xcdBcc28b0D9F3582E33e52c01C08966064faA373");
  // Load DAO details
  useEffect(() => {
    if (provider) {
      loadDAODetails();
      setTokenType(USDC_ADDRESS); // Default to USDC
    }
  }, [provider, isConnected]);
  
  // Load DAO details
  const loadDAODetails = async () => {
    if (!provider) return;
    
    try {
      setIsLoading(true);
      setError("");
      console.log("Loading DAO details for:", daoAddress);
      
      const daoContract = new ethers.Contract(
        daoAddress,
        DAOImplementationABI,
        provider
      );
      
      // Get DAO name
      const name = await daoContract.name();
      setDaoName(name);
      
      setIsLoading(false);
      
    } catch (error: any) {
      console.error("Error loading DAO details:", error);
      setError(error.message || "Failed to load DAO details");
      setIsLoading(false);
    }
  };
  
  // Create a new proposal
  const createProposal = async () => {
    if (!signer || !isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    // Validate inputs
    if (!proposalName || !proposalDescription || !interestRate || !minimumStakerBalance || 
         !maximumTVL || !proposalQuorum || !closingDays || !tokenType) {
      setCreationError("Please fill in all fields");
      return;
    }
    
    try {
      setIsCreating(true);
      setCreationError("");
      setCreationSuccess("");
      
      console.log("Creating new proposal for DAO:", daoAddress);
      
      const daoContract = new ethers.Contract(
        daoAddress,
        DAOImplementationABI,
        signer
      );
      
      // Log parameters for debugging
      console.log("Proposal Parameters:", {
        name: proposalName,
        description: proposalDescription,
        tokenType,
        interestRate: parseInt(interestRate),
        minimumStakerBalance: ethers.utils.parseUnits(minimumStakerBalance, 6),
        maximumTVL: ethers.utils.parseUnits(maximumTVL, 6),
        proposalQuorum: parseInt(proposalQuorum),
        closingDays: parseInt(closingDays)
      });
      
      // Create the proposal
      const tx = await daoContract.createStakingProposal(
        proposalName,
        proposalDescription,
        tokenType,
        parseInt(interestRate),
        ethers.utils.parseUnits(minimumStakerBalance, 6), // Assuming 6 decimals for USDC
        ethers.utils.parseUnits(maximumTVL, 6),
        parseInt(proposalQuorum),
        parseInt(closingDays),
        { gasLimit: 5000000 } // Higher gas limit
      );
      
      console.log("Proposal creation transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Proposal created successfully:", receipt);
      
      // Look for the event that has the proposal address
      let proposalAddress = "";
      for (const log of receipt.logs) {
        try {
          const parsed = daoContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data as string
          });
          if (parsed?.name === "ProposalCreated") {
            proposalAddress = parsed.args.proposalAddress;
            break;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      setCreationSuccess(`Proposal "${proposalName}" created successfully!`);
      
      // Clear form
      setProposalName("");
      setProposalDescription("");
      setInterestRate("5");
      setMinimumStakerBalance("100");
      setMaximumTVL("1000000");
      setProposalQuorum("51");
      setClosingDays("30");
      
      // Redirect to DAO page after a short delay
      setTimeout(() => {
        router.push(`/dao`);
      }, 2000);
      
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      setCreationError(error.message || "Failed to create proposal");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href={`/dao`} 
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to DAO
          </Link>
        </div>
        
        {/* Create Proposal Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
              <h1 className="text-2xl font-bold mb-2">Create New Proposal</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                For DAO: {daoName}
              </p>
              
              {creationSuccess && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded">
                  <p className="text-green-800 dark:text-green-200">{creationSuccess}</p>
                </div>
              )}
              
              {creationError && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded">
                  <p className="text-red-800 dark:text-red-200">{creationError}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Proposal Name</label>
                  <input
                    type="text"
                    value={proposalName}
                    onChange={(e) => setProposalName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    placeholder="USDC Staking Pool"
                    disabled={isCreating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={proposalDescription}
                    onChange={(e) => setProposalDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    placeholder="A staking pool for USDC with competitive interest rates"
                    rows={3}
                    disabled={isCreating}
                  />
                </div>
                
                {/* Pool Parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      min="1"
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Staker Balance</label>
                    <input
                      type="number"
                      value={minimumStakerBalance}
                      onChange={(e) => setMinimumStakerBalance(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      min="1"
                      disabled={isCreating}
                    />
                  </div>                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Maximum TVL</label>
                    <input
                      type="number"
                      value={maximumTVL}
                      onChange={(e) => setMaximumTVL(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      min="1"
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Proposal Quorum (%)</label>
                    <input
                      type="number"
                      value={proposalQuorum}
                      onChange={(e) => setProposalQuorum(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      min="51"
                      max="100"
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Closing Days</label>
                    <input
                      type="number"
                      value={closingDays}
                      onChange={(e) => setClosingDays(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      min="1"
                      disabled={isCreating}
                    />
                  </div>
                </div>
                
                {/* Token Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Token Type</label>
                  <select
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    disabled={isCreating}
                  >
                    <option value={USDC_ADDRESS}>USDC</option>
                    <option value={MYRC_ADDRESS}>MYRC</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supported tokens: USDC, MYRC, and NITRO (governance)
                  </p>
                </div>
                
                {/* Submit Button */}
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition disabled:opacity-50"
                  onClick={createProposal}
                  disabled={isCreating || !isConnected}
                >
                  {isCreating ? "Creating Proposal..." : "Create Proposal"}
                </button>
                
                {!isConnected && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center mt-2">
                    Please connect your wallet to create a proposal
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 