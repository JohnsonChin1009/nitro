import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import NitroCreditSBT from "@/contract-artifacts/NitroCreditSBT.json";

export async function POST(request: NextRequest) {
  const { tokenId } = await request.json();

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
  }

  try {
    const contractAddress = "0xd7121344156D594Eb875213d0bdBf2BA24117944";
    const contractABI = NitroCreditSBT.abi;
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io/");
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const profile = await contract.creditProfiles(tokenId);

    const userData = {
      creditScore: Number(profile.creditScore),
      reputationScore: Number(profile.reputationScore),
      lastActivity: Number(profile.lastActivity),
      totalTransactions: Number(profile.totalTransactions),
      isActive: profile.isActive,
    };

    return NextResponse.json({ userData }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching user data from contract:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}