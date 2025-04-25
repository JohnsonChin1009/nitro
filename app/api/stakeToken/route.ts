import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import LendingPoolABI from '@/app/abis/LendingPool.json';
import MYRCABI from '@/app/abis/MYRC.json';

export async function POST(req: NextRequest) {
  const { poolAddress, stakeAmount } = await req.json();

  if (!poolAddress || !stakeAmount) {
    return NextResponse.json({ error: 'Missing pool address or stake amount' }, { status: 400 });
  }

  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io/");
    console.log("provider: ", provider);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider); // 🔑 Use wallet with private key
    console.log("wallet: ", wallet);
    const poolContract = new ethers.Contract(poolAddress, LendingPoolABI, wallet);
    console.log("poolContract: ", poolContract);
    const myrcTokenAddress = "0x94dfC12cc674090615106d4EA1057d6adF82BD99";
    const myrcContract = new ethers.Contract(myrcTokenAddress, MYRCABI, wallet);

    // Step 1: Approve the pool to spend MYRC
    const approveTx = await myrcContract.approve(poolAddress, stakeAmount);
    await approveTx.wait();

    // Step 2: Stake into the pool
    const stakeTx = await poolContract.stake(stakeAmount);
    await stakeTx.wait();

    return NextResponse.json({ success: true, transactionHash: stakeTx.hash }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error staking:', error);
    return NextResponse.json({ error: 'Stake failed', details: (error as Error).message }, { status: 500 });
  }
}
