import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import LendingPool from '@/contract-artifacts/LendingPool.json';

// Helper: Recursively convert BigInt to string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacerBigIntToString(key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

export async function POST(req: NextRequest) {
  const { poolAddress } = await req.json();

  if (!poolAddress) {
    return NextResponse.json({ error: 'Missing pool address' }, { status: 400 });
  }

  try {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rpc.scroll.io/');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(poolAddress, LendingPool, wallet);

    const poolInfoRaw = await contract.getPoolInfo();

    // Convert BigInt values to string
    const poolInfo = JSON.parse(JSON.stringify(poolInfoRaw, replacerBigIntToString));

    return NextResponse.json({ success: true, poolInfo }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error starting to fetching lending pool:', error);
    return NextResponse.json({ error: 'Fetch failed', details: (error as Error).message }, { status: 500 });
  }
}