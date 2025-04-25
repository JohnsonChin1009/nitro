"use client";

import LendingPoolCard from "@/components/custom/LendingPoolCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import MockUSDC from "@/contract-artifacts/MockUSDC.json";
import LendingPool from "@/contract-artifacts/LendingPool.json";

// Token contract addresses for displaying token names
const MYRC_ContractAddress = "0xcdBcc28b0D9F3582E33e52c01C08966064faA373";
const USDC_ContractAddress = "0x824Ec7410B298599956CcBE90e448862E9514012";

interface LendingPoolData {
  name: string;
  description: string;
  tokenAddress: string;
  interestRate: string;
  tvl: string;
  creator: string;
  quorum: string;
  expirationDate: number;
  isActive: boolean;
  stakersCount: string;
  minimumStakerBalance: string;
  governanceToken: string;
}

export default function PoolSection() {
  const [poolAddressArray, setPoolAddressArray] = useState<string[]>([]);
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(null);
  const [detailedPoolData, setDetailedPoolData] = useState<LendingPoolData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  
  // Get Privy authentication context
  const { authenticated} = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    async function getAllAddresses() {
      try {
        const response = await fetch("/api/getAllLendingPool", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lending pool addresses.");
        }

        const data = await response.json();
        console.log("Fetched lending pool addresses:", data);
        setPoolAddressArray(data.pools);
      } catch (error) {
        console.error("Error fetching lending pools:", error);
      }
    }

    getAllAddresses();
  }, []);

  useEffect(() => {
    if (selectedPoolAddress) {
      fetchPoolDetails(selectedPoolAddress);
    }
  }, [selectedPoolAddress]);

  const fetchPoolDetails = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fetchLendingPool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poolAddress: address }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched detailed pool data: ", data);

      const formattedData: LendingPoolData = {
        name: data.poolInfo[0],
        description: data.poolInfo[1],
        tokenAddress: data.poolInfo[2],
        interestRate: data.poolInfo[3],
        tvl: data.poolInfo[4],
        creator: data.poolInfo[5],
        quorum: data.poolInfo[6],
        expirationDate: Number(data.poolInfo[7]),
        isActive: data.poolInfo[8],
        stakersCount: data.poolInfo[9],
        minimumStakerBalance: data.poolInfo[10],
        governanceToken: data.poolInfo[11],
      };

      setDetailedPoolData(formattedData);
    } catch (error) {
      console.error("Error fetching pool details:", error);
      toast("Failed to load pool details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPoolDetails = (address: string) => {
    setSelectedPoolAddress(address);
  };

  const handleBackToList = () => {
    setSelectedPoolAddress(null);
    setDetailedPoolData(null);
  };

  const handleBorrow = async () => {
    if (!authenticated) {
      toast.error("Please connect your wallet first.");
      return;
    }
  
    const userWallet = wallets[0];
  
    try {
      const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(USDC_ContractAddress, MockUSDC, signer);
  
      const lendingPoolAddress = selectedPoolAddress || "";
      const borrowAmount = 0.0001; // Adjust this value as needed or pass it dynamically
      const borrowAmountWei = ethers.parseUnits(borrowAmount.toString(), 18); // Assuming 18 decimals for USDC
  
      // Approve the lending pool to spend the borrowAmount on behalf of the user
      const approveTx = await contract.approve(lendingPoolAddress, borrowAmountWei);
      await approveTx.wait();
  
      // Now initiate the borrowing process (ensure there's a function for borrowing in the lending pool)
      const lendingPoolContract = new ethers.Contract(lendingPoolAddress, LendingPool, signer);
  
      const borrowTx = await lendingPoolContract.borrow(borrowAmountWei);
      await borrowTx.wait();
  
      toast.success("Successfully borrowed!");
    } catch (error: unknown) {
      console.error("Error during borrowing process:", error);
      toast.error("Borrowing failed");
    }
  };
  

  // Render the detailed view of a single pool when selected
  if (selectedPoolAddress) {
    // Show loading state while fetching detailed data
    if (isLoading || !detailedPoolData) {
      return (
        <div className="p-6">
          <button 
            onClick={handleBackToList}
            className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to pools
          </button>
          
          <div className="w-full max-w-4xl mx-auto animate-pulse">
            <div className="h-40 bg-slate-200 rounded mb-4"></div>
            <div className="h-60 bg-slate-200 rounded"></div>
          </div>
        </div>
      );
    }

    // Determine token type
    const tokenType = detailedPoolData.tokenAddress.toLowerCase() === MYRC_ContractAddress.toLowerCase() 
      ? "MYRC"
      : detailedPoolData.tokenAddress.toLowerCase() === USDC_ContractAddress.toLowerCase()
      ? "USDC"
      : "Unknown";

    // Format the expiration date
    const expirationDate = new Date(detailedPoolData.expirationDate * 1000);
    const expirationDateFormatted = expirationDate.toLocaleDateString();

    return (
      <div className="p-6">
        <button 
          onClick={handleBackToList}
          className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to pools
        </button>
        
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{detailedPoolData.name}</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${detailedPoolData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {detailedPoolData.isActive ? <strong>Active</strong> : "Inactive"}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{detailedPoolData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pool Address</h3>
                  <a 
                    href={`https://sepolia.scrollscan.com/address/${selectedPoolAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline font-mono break-all"
                  >
                    {selectedPoolAddress}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Token</h3>
                  <div className="flex items-center">
                    <a 
                      href={`https://sepolia.scrollscan.com/address/${detailedPoolData.tokenAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-mono break-all mr-2"
                    >
                      {detailedPoolData.tokenAddress}
                    </a>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">{tokenType}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                  <p className="text-lg font-semibold text-gray-800">{detailedPoolData.interestRate}%</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">TVL (Total Value Locked)</h3>
                  <p className="text-lg font-semibold text-gray-800">{detailedPoolData.tvl} {tokenType}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Creator</h3>
                  <a 
                    href={`https://sepolia.scrollscan.com/address/${detailedPoolData.creator}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline font-mono break-all"
                  >
                    {detailedPoolData.creator}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quorum</h3>
                  <p className="text-sm text-gray-800">{detailedPoolData.quorum}%</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expires On</h3>
                  <p className="text-sm text-gray-800">{expirationDateFormatted}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Stakers</h3>
                  <p className="text-lg font-semibold text-gray-800">{detailedPoolData.stakersCount}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <div className="mt-4">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Borrow from this Pool</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the amount you want to borrow. You&apos;ll need to stake 5% of the borrowed amount as collateral.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow">
                      <label htmlFor="borrowAmount" className="text-sm font-medium text-gray-500 mb-1 block">
                        Amount to Borrow
                      </label>
                      <Input
                        id="borrowAmount"
                        type="number"
                        placeholder={`Enter amount in ${tokenType}`}
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        className="w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleBorrow}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={isBorrowing || !detailedPoolData.isActive || !borrowAmount}
                      >
                        {!authenticated ? (
                          <>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M20 12V8H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h14v4" />
                              <path d="M20 12v4H6a2 2 0 0 0-2 2v-6" />
                            </svg>
                            Connect & Borrow
                          </>
                        ) : isBorrowing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Borrow
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the grid of pool cards (default view)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {poolAddressArray.map((address) => (
        <div className="w-full h-full" key={address}>
          <LendingPoolCard 
            poolAddress={address} 
            onViewDetails={handleViewPoolDetails} 
          />
        </div>
      ))}
    </div>
  );
}