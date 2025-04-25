import { NextRequest, NextResponse } from "next/server";
import NitroCreditSBT from "@/contract-artifacts/NitroCreditSBT.json"
import { ethers } from "ethers";

export async function POST(request: NextRequest) {
    const { walletAddress } = await request.json();
    const NITRO_SBT_ADDRESS = "0xd7121344156D594Eb875213d0bdBf2BA24117944";
    const SCROLL_RPC_URL = "https://sepolia-rpc.scroll.io/"

    if (!walletAddress) {
        return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    try {
        const provider = new ethers.JsonRpcProvider(SCROLL_RPC_URL);
        const contract = new ethers.Contract(NITRO_SBT_ADDRESS, NitroCreditSBT.abi, provider);

        const hasToken = await contract.hasToken(walletAddress);

        if (hasToken) {
            const tokenId = await contract.getTokenId(walletAddress);
            localStorage.setItem("tokenID", tokenId);
            return NextResponse.json({ hasToken: true, tokenId: tokenId.toString() });
        } else {
            return NextResponse.json({ hasToken: false, tokenId: null });
        }
    } catch (error: unknown) {
        console.error("Error checking SBT:", error);
        return NextResponse.json({ error: "Error checking SBT" }, { status: 500 });
    }
}