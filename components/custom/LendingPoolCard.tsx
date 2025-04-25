"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Token contract addresses
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

interface LendingPoolProps {
  poolAddress: string;
  onViewDetails?: (address: string) => void;
}

export default function LendingPoolCard({ poolAddress, onViewDetails }: LendingPoolProps) {
  const [poolData, setPoolData] = useState<LendingPoolData | null>(null);

  useEffect(() => {
    async function fetchLendingPoolData() {
      try {
        const response = await fetch("/api/fetchLendingPool", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ poolAddress }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched lending pool data: ", data);

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

        setPoolData(formattedData);
      } catch (error: unknown) {
        console.error("Error fetching lending pool:", error);
        toast("Fetch failed");
      }
    }

    fetchLendingPoolData();
  }, [poolAddress]);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(poolAddress);
    }
  };

  if (!poolData) {
    return (
      <div className="w-full p-6 rounded-lg bg-slate-50 animate-pulse">
        <div className="h-5 w-3/4 bg-slate-200 rounded mb-4"></div>
        <div className="h-3 w-full bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-slate-200 rounded mb-4"></div>
        <div className="h-8 w-full bg-slate-200 rounded"></div>
      </div>
    );
  }

  // Format the expiration date
  const expirationDate = new Date(poolData.expirationDate * 1000);
  const expirationDateFormatted = expirationDate.toLocaleDateString();

  // Determine token type
  const tokenType = poolData.tokenAddress.toLowerCase() === MYRC_ContractAddress.toLowerCase() 
    ? "MYRC"
    : poolData.tokenAddress.toLowerCase() === USDC_ContractAddress.toLowerCase()
    ? "USDC"
    : "Unknown";

  return (
    <div className="w-full p-6 rounded-lg bg-white shadow border border-gray-100 hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{poolData.name}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${poolData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {poolData.isActive ? <strong>Active</strong> : "Inactive"}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{poolData.description}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="text-sm font-medium">{poolData.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">TVL</p>
          <p className="text-sm font-medium">{poolData.tvl} {tokenType}</p>
        </div>
      </div>
      
      <div className="pt-3 border-t border-gray-100">
        <div className="mb-2">
          <p className="text-xs text-gray-500">Creator</p>
          <a 
            href={`https://sepolia.scrollscan.com/address/${poolData.creator}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline overflow-hidden text-ellipsis"
          >
            {poolData.creator.slice(0, 6)}...{poolData.creator.slice(-4)}
          </a>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Expires</p>
          <p className="text-sm" title={expirationDateFormatted}>{expirationDateFormatted}</p>
        </div>
      </div>
      
      <button 
        onClick={handleViewDetails}
        className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="View pool details"
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
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
