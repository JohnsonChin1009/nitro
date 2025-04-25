import { NextResponse } from "next/server";
import { ethers } from "ethers";
import DAOImplementation from "@/contract-artifacts/DAOImplementation.json";
import { DAOImplementation_ContractAddress } from "@/lib/contractAddress";
export async function GET() {
    try {
        const contractAddress = DAOImplementation_ContractAddress;
        const contractABI = DAOImplementation;
        const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io/");
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const pools = await contract.getAllRegisteredLendingPools();

        return NextResponse.json({ "pools": pools }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching lending pools:", error);
        return NextResponse.json({ error: "Failed to fetch lending pools" }, { status: 500 });
    }
}