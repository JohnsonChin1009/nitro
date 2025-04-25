'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { ethers } from 'ethers';
import LendingPoolABI from '@/contract-artifacts/LendingPool.json'; // Adjusted path
import USDC_ContractAddress from "@/contract-artifacts/MockUSDC.json"
interface PoolInfo {
  [index: number]: string | ethers.BigNumber | boolean; // Array indices
  _name: string;
  _description: string;
  _tokenAddress: string;
  _interestRate: ethers.BigNumber;
  _tvl: ethers.BigNumber;
  _creator: string;
  _quorum: ethers.BigNumber;
  _expirationDate: ethers.BigNumber;
  _isActive: boolean;
  _stakerCount: ethers.BigNumber;
  _minimumStakerBalance: ethers.BigNumber;
  _governanceToken: string;
  length: number;
}

export default function LendingPoolPage() {
  const params = useParams();
  const contractAddress = params.address as string;

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [borrowAmount, setBorrowAmount] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isStaker, setIsStaker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowError, setBorrowError] = useState<string | null>(null);
  const [borrowSuccess, setBorrowSuccess] = useState<string | null>(null);
  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  const [stakeSuccess, setStakeSuccess] = useState<string | null>(null);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string>('Tokens'); // Default symbol
  const [tokenDecimals, setTokenDecimals] = useState<number>(18); // Default decimals
  const [stakeAmount, setStakeAmount] = useState<string>('1000'); // Default stake amount
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [isBorrower, setIsBorrower] = useState<boolean>(false);
  const [initialStakeAmount, setInitialStakeAmount] = useState<string>('');


  // Initialize provider, signer, and contract
  useEffect(() => {
    const initEthers = async () => {
      if (typeof window.ethereum !== 'undefined' && contractAddress) {
        try {
          // Force refresh the provider to get the latest state
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          setProvider(web3Provider);

          // Request accounts to check if already connected
          let accounts;
          try {
            // This is a soft request that won't trigger the MetaMask popup
            accounts = await window.ethereum.request({ method: 'eth_accounts' });
          } catch (err) {
            console.error('Error checking accounts:', err);
            accounts = [];
          }

          if (accounts.length > 0) {
            const web3Signer = await web3Provider.getSigner();
            setSigner(web3Signer);
            const currentAddress = await web3Signer.getAddress();
            console.log('Currently connected address:', currentAddress);
            setUserAddress(currentAddress);

            const poolContract = new ethers.Contract(
              contractAddress,
              LendingPoolABI,
              web3Signer
            );
            setContract(poolContract);
          } else {
            // Handle case where user is not connected yet
             const poolContract = new ethers.Contract(
               contractAddress,
               LendingPoolABI,
               web3Provider // Use provider for read-only access initially
             );
             setContract(poolContract);
             console.log('MetaMask is installed but not connected.');
          }
        } catch (err: any) {
          console.error('Error initializing ethers:', err);
          setError(`Error initializing connection: ${err.message}`);
        }
      } else if (contractAddress) {
          // Fallback to a default provider for read-only access if no wallet
          try {
              const defaultProvider = ethers.getDefaultProvider(); // Or specify a network like 'mainnet'
              const poolContract = new ethers.Contract(
                  contractAddress,
                  LendingPoolABI,
                  defaultProvider
              );
              setContract(poolContract);
              setError('MetaMask not found. Displaying read-only data.');
          } catch (readErr: any) {
               console.error('Error initializing read-only contract:', readErr);
               setError(`Error initializing read-only contract: ${readErr.message}`);
          }
      } else {
          setError('Contract address not found in URL.');
      }
    };
    initEthers();
    
    // Run this effect again if window.ethereum changes
    // This helps detect when the user manually connects in MetaMask
    const checkConnection = () => {
      if (window.ethereum?.selectedAddress && !userAddress) {
        console.log('Detected MetaMask connection outside component, refreshing...');
        initEthers();
      }
    };
    
    // Check periodically for external wallet connections
    const connectionCheckInterval = setInterval(checkConnection, 1000);
    return () => clearInterval(connectionCheckInterval);
  }, [contractAddress, userAddress]);

  // Add event listeners for MetaMask account and chain changes
  useEffect(() => {
    // Function to handle account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('MetaMask accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected all accounts
        setSigner(null);
        setUserAddress(null);
        setIsStaker(false);
        setIsBorrower(false);
        setError('Wallet disconnected. Please connect your wallet to continue.');
      } else {
        // User switched to a different account
        if (provider) {
          const web3Signer = provider.getSigner();
          setSigner(web3Signer);
          const newAddress = await web3Signer.getAddress();
          setUserAddress(newAddress);
          console.log('Switched to account:', newAddress);
          
          // Re-initialize contract with new signer
          const poolContract = new ethers.Contract(
            contractAddress,
            LendingPoolABI,
            web3Signer
          );
          setContract(poolContract);
          setError(null);
        }
      }
    };

    // Function to handle chain changes
    const handleChainChanged = () => {
      console.log('MetaMask chain changed, reloading page');
      window.location.reload();
    };

    // Add listeners if provider exists
    if (window.ethereum) {
      // Check immediately if accounts exist on this effect run
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0 && !userAddress) {
            console.log('Found accounts on listener init:', accounts);
            handleAccountsChanged(accounts);
          }
        })
        .catch((err: any) => console.error('Error checking accounts in listener:', err));
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Also handle connect event
      window.ethereum.on('connect', () => {
        console.log('MetaMask connected event fired');
        window.ethereum.request({ method: 'eth_accounts' })
          .then(handleAccountsChanged)
          .catch((err: any) => console.error('Error handling connect event:', err));
      });
    }

    // Cleanup function to remove listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', () => console.log('Connect listener removed'));
      }
    };
  }, [provider, contractAddress, userAddress]); // Re-add listeners if provider or userAddress changes

  // Function to fetch basic token info (symbol, decimals)
  const fetchTokenInfo = async (tokenAddress: string, currentProvider: ethers.providers.Provider) => {
    if (!tokenAddress || !currentProvider) return;
    // Minimal ERC20 ABI for symbol and decimals
    const erc20Abi = [
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)"
    ];
    try {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, currentProvider);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        setTokenSymbol(symbol);
        setTokenDecimals(Number(decimals)); // Convert BigInt to number
    } catch (err) {
        console.warn(`Could not fetch token info for ${tokenAddress}:`, err);
        // Keep default symbol/decimals if fetching fails
    }
  };


  // Fetch pool info and check if user is a staker
  useEffect(() => {
    const fetchPoolData = async () => {
      if (!contract) return;
        setIsLoading(true);
        setError(null);
      try {
        console.log("Fetching pool info...");
        const info: PoolInfo = await contract.getPoolInfo();
        console.log("Pool Info:", info);
        setPoolInfo(info);

        // Determine provider to use (signer.provider if available, else provider)
        const currentProvider = signer?.provider || provider;
        if (info._tokenAddress && currentProvider) {
            await fetchTokenInfo(info._tokenAddress, currentProvider);
        }

        if (userAddress) {
          console.log(`Checking stake balance for ${userAddress}...`);
          const stakeBalance: ethers.BigNumber = await contract.stakeBalances(userAddress);
          console.log("Stake Balance:", stakeBalance);
          setIsStaker(!stakeBalance.isZero());
          
          // Check if user is a borrower
          try {
            const borrowBalance: ethers.BigNumber = await contract.borrowBalances(userAddress);
            console.log("Borrow Balance:", borrowBalance);
            setIsBorrower(!borrowBalance.isZero());
          } catch (err) {
            console.error("Error checking borrow balance:", err);
            setIsBorrower(false);
          }
        } else {
          setIsStaker(false); // Cannot be a staker if not connected
          setIsBorrower(false); // Cannot be a borrower if not connected
        }

      } catch (err: any) {
        console.error('Error fetching pool data:', err);
        let errorMessage = `Error fetching pool data: ${err.message}.`;
         if (err.data?.message) { // Check for more specific contract revert reason
             errorMessage += ` Reason: ${err.data.message}`;
         } else if (err.reason) {
             errorMessage += ` Reason: ${err.reason}`;
         }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolData();
  }, [contract, userAddress, signer, provider]); // Rerun if contract or user address changes

  const handleConnectWallet = async () => {
     if (provider) {
         try {
             // Use window.ethereum directly for more reliable connection
             const accounts = await window.ethereum.request({ 
                 method: 'eth_requestAccounts' 
             });
             console.log('Accounts after connect:', accounts);
             
             const web3Signer = provider.getSigner();
             setSigner(web3Signer);
             const connectedAddress = await web3Signer.getAddress();
             setUserAddress(connectedAddress);
             // Re-initialize contract with signer
             if(contractAddress) {
                 const poolContract = new ethers.Contract(
                     contractAddress,
                     LendingPoolABI,
                     web3Signer
                 );
                 setContract(poolContract);
             }
             setError(null); // Clear previous errors on successful connect
         } catch (err: unknown) {
              console.error('Failed to connect wallet:', err);
              setError(`Failed to connect wallet: ${err.message}`);
         }
     } else {
         setError("MetaMask is not available. Please install it.");
     }
 };

  const handleDisconnectWallet = () => {
      // Reset wallet states
      setSigner(null);
      setUserAddress(null);
      setIsStaker(false);
      
      // Re-initialize contract with provider (read-only)
      if (provider && contractAddress) {
          const poolContract = new ethers.Contract(
              contractAddress,
              LendingPoolABI,
              provider
          );
          setContract(poolContract);
      }
      
      console.log('Wallet disconnected');
      
      // Note: MetaMask doesn't have a true "disconnect" API, but we can
      // clear our app state to effectively disconnect from our app's perspective
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Allow only numbers and a single decimal point
      const value = e.target.value;
       if (/^\d*\.?\d*$/.test(value)) {
          setBorrowAmount(value);
          setBorrowError(null); // Clear error when user types
       }
  }

  const handleInitialStakeChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Allow only numbers and a single decimal point
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
          setInitialStakeAmount(value);
      }
  }

  const handleStakeAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
      setStakeError(null); // Clear error when user types
    }
  }

  const formatBigInt = (value: ethers.BigNumber | undefined): string => {
     if (value === undefined) return 'N/A';
     try {
         return ethers.formatUnits(value, tokenDecimals);
     } catch (e) {
         console.error("Error formatting BigInt:", e);
         return value.toString(); // Fallback to raw string
     }
  };

   const formatTimestamp = (timestamp: ethers.BigNumber | undefined): string => {
      if (timestamp === undefined || timestamp.isZero()) return 'N/A';
      try {
          const date = new Date(timestamp.toNumber() * 1000); // Convert seconds to milliseconds
          return date.toLocaleString();
      } catch (e) {
          console.error("Error formatting timestamp:", e);
          return timestamp.toString(); // Fallback
      }
  }

  const handleBorrow = async () => {
    if (!contract || !signer || !borrowAmount) {
      setBorrowError("Please connect your wallet and enter an amount to borrow.");
      return;
    }
    
    if (isStaker) {
      setBorrowError("Stakers cannot borrow from their own pool.");
      return;
    }
    
    if (isBorrower) {
      setBorrowError("You already have an outstanding loan from this pool.");
      return;
    }
    
    if (isBorrowing) {
      return; // Already processing a borrow
    }
    
    setBorrowError(null);
    setBorrowSuccess(null);
    setIsBorrowing(true);
    
    try {
      // Convert amount to wei using the token's decimals
      const amountInWei = ethers.parseUnits(borrowAmount, tokenDecimals);
      
      // Calculate the 5% stake required by the contract
      const requiredStakeInWei = amountInWei.mul(5).div(100);
      
      console.log(`Borrowing ${borrowAmount} ${tokenSymbol} with required stake of ${ethers.formatUnits(requiredStakeInWei, tokenDecimals)} ${tokenSymbol}`);
      
      // First approve the token transfer for the 5% stake
      setIsApproving(true);

      const tokenContract = new ethers.Contract(
        poolInfo?._tokenAddress || '',
        USDC_ContractAddress,
        signer
      )

      // Check if user has enough tokens for the stake
      const userBalance = await tokenContract.balanceOf(userAddress);
      if (userBalance.lt(requiredStakeInWei)) {
        setBorrowError(`Insufficient balance for the required 5% stake. You need ${ethers.formatUnits(requiredStakeInWei, tokenDecimals)} ${tokenSymbol}.`);
        setIsBorrowing(false);
        setIsApproving(false);
        return;
      }
      
      // Check and approve if necessary
      const currentAllowance = await tokenContract.allowance(userAddress, contractAddress);
      if (currentAllowance.lt(requiredStakeInWei)) {
        setBorrowSuccess("Approving token transfer...");
        const approveTx = await tokenContract.approve(contractAddress, requiredStakeInWei);
        await approveTx.wait();
      }
      setIsApproving(false);
      
      // Execute the borrow
      setBorrowSuccess("Processing borrow transaction...");
      const tx = await contract.borrow(amountInWei);
      setBorrowSuccess("Transaction submitted. Waiting for confirmation...");
      
      await tx.wait();
      
      setBorrowSuccess(`Successfully borrowed ${borrowAmount} ${tokenSymbol}!`);
      setBorrowAmount(''); // Clear input
      
      // Refresh pool data
      const info = await contract.getPoolInfo();
      setPoolInfo(info);
      setIsBorrower(true);
    } catch (error: any) {
      console.error("Borrow transaction failed:", error);
      
      // Extract error message
      let errorMessage = error.message || "Transaction failed";
      if (error.data?.message) errorMessage = error.data.message;
      else if (error.reason) errorMessage = error.reason;
      
      // Handle specific errors
      if (errorMessage.includes("Not enough liquidity")) {
        setBorrowError("The pool doesn't have enough liquidity. Try a smaller amount.");
      } else if (errorMessage.includes("Already has an active loan")) {
        setBorrowError("You already have an active loan from this pool.");
        setIsBorrower(true);
      } else if (errorMessage.includes("Stake transfer failed")) {
        setBorrowError("Failed to transfer the required stake. Check your token balance.");
      } else if (errorMessage.includes("Pool is not active")) {
        setBorrowError("This pool is no longer active.");
      } else {
        setBorrowError(`Error: ${errorMessage}`);
      }
      
      setBorrowSuccess(null);
    } finally {
      setIsBorrowing(false);
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    const stakeAmount = 10;
   const result = await fetch("/api/stake", {
    method: "POST",
    body: JSON.stringify({ poolAddress: contractAddress, stakeAmount: stakeAmount, userAddress: userAddress }),
   });
   const data = await result.json();
   if (!data.success) {
    setStakeError(data.error);
   } else {
    setStakeSuccess("Stake successful");
   }
   console.log("Stake result: ", data);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Lending Pool Details</h1>

      <button onClick={handleStake}>Stake</button>
      <h1>${stakeAmount}</h1>
      <h1>${stakeError}</h1>
      <h1>${stakeSuccess}</h1>
      <p><strong>Contract Address:</strong> {contractAddress}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        {!userAddress && provider && (
          <button onClick={handleConnectWallet} style={{ marginBottom: '15px', padding: '10px', cursor: 'pointer' }}>
              Connect Wallet
          </button>
        )}
        {userAddress && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p><strong>Connected Wallet:</strong> {userAddress}</p>
            <button 
              onClick={handleDisconnectWallet} 
              style={{ 
                padding: '8px 12px', 
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {isLoading && <p>Loading pool information...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {poolInfo && !isLoading && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>{poolInfo._name}</h2>
          <p>{poolInfo._description}</p>
          <p><strong>Status:</strong> {poolInfo._isActive ? 'Active' : 'Inactive'}</p>
          <p><strong>Token:</strong> {tokenSymbol} ({poolInfo._tokenAddress})</p>
          <p><strong>Total Value Locked (TVL):</strong> {formatBigInt(poolInfo._tvl)} {tokenSymbol}</p>
          <p><strong>Interest Rate (per second):</strong> {(poolInfo._interestRate.toNumber() / 100).toFixed(2)}% </p>
          <p><strong>Stakers:</strong> {formatBigInt(poolInfo._stakerCount)}</p>
          <p><strong>Minimum Stake:</strong> {formatBigInt(poolInfo._minimumStakerBalance)} {tokenSymbol}</p>
          <p><strong>Quorum (Required TVL % to Borrow):</strong> {formatBigInt(poolInfo._quorum)}%</p>
          <p><strong>Expires:</strong> {formatTimestamp(poolInfo._expirationDate)}</p>
          <p><strong>Creator:</strong> {poolInfo._creator}</p>
          <p><strong>Governance Token:</strong> {poolInfo._governanceToken}</p>
          
          {/* Debug info */}
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p><strong>Debug Info:</strong></p>
            <p>Is Active: {String(poolInfo._isActive)}</p>
            <p>Has Contract: {String(!!contract)}</p>
            <p>Has Signer: {String(!!signer)}</p>
            <p>User Address: {userAddress || 'Not connected'}</p>
            <p>Is Staker: {String(isStaker)}</p>
            <p>Is Borrower: {String(isBorrower)}</p>
          </div>
        </div>
      )}

      {poolInfo && contract && signer && userAddress && poolInfo._isActive && !isStaker && !isBorrower && (
        <div className="pool-actions" style={{ display: 'flex', gap: '20px' }}>
          {/* Stake Section */}
          <div style={{ flex: 1, marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h2>Stake in Pool</h2>
            <p style={{ marginBottom: '15px' }}>Stake tokens to earn interest from borrowers.</p>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="stakeAmount">Amount to Stake ({tokenSymbol}):</label>
              <input
                type="text"
                id="stakeAmount"
                value={stakeAmount}
                onChange={handleStakeAmountChange}
                placeholder={`Min: ${formatBigInt(poolInfo._minimumStakerBalance)}`}
                disabled={isStaking}
                style={{ marginLeft: '10px', padding: '8px', marginRight: '10px', width: '150px' }}
              />
            </div>
            <button
              onClick={handleStake}
              disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
              style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Stake Tokens'}
            </button>
            {stakeError && <p style={{ color: 'red', marginTop: '10px' }}>{stakeError}</p>}
            {stakeSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{stakeSuccess}</p>}
          </div>
          
          {/* Borrow Section */}
          <div style={{ flex: 1, marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h2>Borrow Funds</h2>
            <p style={{ marginBottom: '15px' }}>Borrow tokens from this pool. A 5% stake will be required.</p>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="borrowAmount">Amount to Borrow ({tokenSymbol}):</label>
              <input
                type="text"
                id="borrowAmount"
                value={borrowAmount}
                onChange={handleAmountChange}
                placeholder={`e.g., 100`}
                disabled={isBorrowing}
                style={{ marginLeft: '10px', padding: '8px', marginRight: '10px', width: '150px' }}
              />
            </div>
            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
              Required stake: {borrowAmount ? (parseFloat(borrowAmount) * 0.05).toFixed(2) : '0'} {tokenSymbol} (5%)
            </p>
            <button
              onClick={handleBorrow}
              disabled={isBorrowing || !borrowAmount || parseFloat(borrowAmount) <= 0}
              style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {isApproving ? 'Approving...' : isBorrowing ? 'Borrowing...' : 'Borrow Tokens'}
            </button>
            {borrowError && <p style={{ color: 'red', marginTop: '10px' }}>{borrowError}</p>}
            {borrowSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{borrowSuccess}</p>}
          </div>
        </div>
      )}
      
      {/* Show existing staker status */}
      {poolInfo && contract && signer && userAddress && poolInfo._isActive && isStaker && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>Staker Status</h2>
          <p style={{ color: 'green' }}>You are currently a staker in this pool. You're earning interest from borrowers!</p>
          <p>You cannot borrow from this pool while you are a staker.</p>
        </div>
      )}
      
      {/* Show existing borrower status */}
      {poolInfo && contract && signer && userAddress && poolInfo._isActive && isBorrower && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>Borrower Status</h2>
          <p style={{ color: 'blue' }}>You currently have an active loan from this pool.</p>
          <p>You cannot stake in this pool while you have an outstanding loan.</p>
        </div>
      )}
      
      {poolInfo && !poolInfo._isActive && (
          <p style={{ color: 'grey', marginTop: '20px' }}>This pool is currently inactive and not accepting borrows.</p>
      )}
       {!signer && poolInfo && poolInfo._isActive && (
            <p style={{ color: 'orange', marginTop: '20px' }}>Please connect your wallet to borrow from this pool.</p>
       )}
    </div>
  );
}