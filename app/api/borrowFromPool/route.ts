import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import LendingPoolABI from "@/contract-artifacts/LendingPool.json";

export async function POST(req: NextRequest) {
  try {
    const { poolAddress, amount, walletAddress } = await req.json();

    // Validate input parameters
    if (!poolAddress || !amount || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required parameters: poolAddress, amount, and walletAddress are required" },
        { status: 400 }
      );
    }

    // Convert amount to appropriate format (wei)
    const borrowAmount = ethers.parseUnits(amount.toString(), 18);

    // Connect to the Ethereum provider (Scroll Sepolia)
    const provider = new ethers.JsonRpcProvider("https://sepolia.scrollscan.com/");
    
    // You would need to use a private key or other authentication method in production
    // For this example, we're using a signer from a private key - in production, this should be the user's wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "Server wallet configuration error" },
        { status: 500 }
      );
    }
    
    const signer = new ethers.Wallet(privateKey, provider);
    
    // Connect to the lending pool contract using the imported ABI
    const lendingPool = new ethers.Contract(poolAddress, LendingPoolABI, signer);
    
    // Check if the user already has an active loan
    const existingLoan = await lendingPool.borrowedAmount(walletAddress);
    if (existingLoan > 0) {
      return NextResponse.json(
        { error: "User already has an active loan" },
        { status: 400 }
      );
    }
    
    // Get pool information to verify it's active
    const poolInfo = await lendingPool.getPoolInfo();
    const isActive = poolInfo[8]; // The 9th item in the returned tuple is isActive
    
    if (!isActive) {
      return NextResponse.json(
        { error: "This lending pool is not active" },
        { status: 400 }
      );
    }
    
    // Execute the borrowing transaction
    // Note: In a real application, you would likely want to simulate this first
    // to check for potential errors before sending the transaction
    const tx = await lendingPool.borrow(borrowAmount);
    
    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();
    
    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      message: `Successfully borrowed ${amount} tokens from pool`
    });
    
  } catch (error: any) {
    console.error("Error borrowing from pool:", error);
    
    // Extract useful error message
    let errorMessage = "Failed to borrow from pool";
    if (error.message) {
      errorMessage = error.message;
      
      // Extract the revert reason if it exists
      const revertReasonMatch = error.message.match(/reason="([^"]+)"/);
      if (revertReasonMatch && revertReasonMatch[1]) {
        errorMessage = revertReasonMatch[1];
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}