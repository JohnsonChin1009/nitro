"use client";

import Image from "next/image";

export default function ProfileSection() {
  const recentActivity = [
    "Staked 500 MYR into Pool A",
    "Borrowed 300 MYR from Community Pool",
    "Claimed rewards from Pool B",
    "Voted on Proposal #3",
  ];

  const user = {
    wallet: "0x1234...89Fa",
    role: "Staker",
    nftImage: "https://ipfs.io/ipfs/bafkreialbyjuyfezwk7txbdikx6rah3lcxajgjbpf3t3uw4ujb4w34mfo4", // placeholder NFT image
    nftName: "Nitro Access Pass",
    nftId: "#0198",
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8 w-full">
      {/* Recent Activity */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
          {recentActivity.map((activity, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-gray-50 transition duration-200"
            >
              {activity}
            </div>
          ))}
        </div>
      </div>

      {/* NFT Profile Card */}
      <div className="w-full md:w-[300px]">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center gap-4">
          <div className="relative w-32 h-32">
          <Image
            src={user.nftImage}
            alt="NFT"
            className="rounded-lg border object-cover"
            fill
          />
                    </div>
          <div>
            <p className="text-sm text-gray-500">NFT Name</p>
            <p className="font-semibold">{user.nftName} {user.nftId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="font-mono text-sm">{user.wallet}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}