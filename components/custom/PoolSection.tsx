"use client";

import LendingPoolCard from "@/components/custom/LendingPoolCard";
import { useEffect, useState } from "react";

export default function PoolSection() {
  const [poolAddressArray, setPoolAddressArray] = useState<string[]>([]);

  useEffect(() => {
    async function getAllAddresses() {
      try {
        const response = await fetch("/api/getAllLendingPool", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lending pool addresses.");
        }

        const data = await response.json();
        console.log("Fetched lending pool addresses:", data);
        setPoolAddressArray(data.pools);
      } catch (error) {
        console.error("Error fetching lending pools:", error);
      }
    }

    getAllAddresses();
  }, []);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {poolAddressArray.map((address) => (
        <LendingPoolCard key={address} poolAddress={address} />
      ))}
    </div>
  );
}