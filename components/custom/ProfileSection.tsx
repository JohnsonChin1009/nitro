"use client";

import { useEffect, useState } from "react";
import { UserCreditProfile } from "@/lib/types";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

export default function ProfileSection() {
  const [userData, setUserData] = useState<UserCreditProfile | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const tokenId = localStorage.getItem("tokenId");
      if (!tokenId) return;

      try {
        const response = await fetch("/api/getUserData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId }),
        });

        const data = await response.json();
        setUserData(data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <Image
                src={user?.avatar_url || "/default-avatar.png"}
                alt="User Avatar"
                className="w-16 h-16 rounded-full object-cover border"
                width={500}
                height={500}
              />
              <h2 className="text-2xl font-semibold">
                {user?.username || "Anonymous"}
              </h2>
            </div>
            <div className="mt-4">
              <XPBar
                label="Reputation"
                value={userData?.reputationScore ?? 0}
                max={100}
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <Stat label="Credit Score" value={userData?.creditScore ?? "--"} />
              <Stat
                label="Last Activity"
                value={
                  userData?.lastActivity
                    ? new Date(Number(userData.lastActivity) * 1000).toLocaleDateString()
                    : "--"
                }
              />
              <Stat
                label="Transactions"
                value={userData?.totalTransactions ?? "--"}
              />
              <Stat
                label="Status"
                value={userData?.isActive ? "🟢 Active" : "🔴 Inactive"}
              />
            </div>
          </div>
        </div>

        {/* Right Column: NFT Card */}
        <div className="flex-1">
          <div className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-6 text-center h-full flex flex-col justify-center items-center relative">
            <Image
              src="https://ipfs.io/ipfs/bafkreic25uxmvbsoqtrpq4c5ihihbhbrumxboubpduki4qxzkb4ehmpjra"
              alt="Nitro Credit SBT"
              className="w-full max-w-sm rounded-xl object-cover mb-4 border"
              width={500}
              height={500}
            />

            <a href={`https://sepolia.scrollscan.com/token/0xd7121344156d594eb875213d0bdbf2ba24117944?a=${localStorage.getItem("walletAddress")}`}  target="_blank" className="text-xl font-semibold mb-2 hover:underline hover:cursor-pointer">Nitro Credit SBT # {localStorage.getItem("tokenId")}</a>
            <p className="text-sm text-zinc-500">
              Soulbound token representing your credit and reputation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-xl font-medium mt-1">{value}</div>
    </div>
  );
}

function XPBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="text-left">
      <div className="text-sm text-zinc-500 mb-1">{label}</div>
      <div className="text-xs text-zinc-400 mb-1">
        {value} / {max} XP
      </div>
      <div className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}