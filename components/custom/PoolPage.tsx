"use client";

import PoolCard from "@/components/custom/PoolCard";

export default function PoolPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      <PoolCard />
      <PoolCard />
      <PoolCard />
      <PoolCard />
      <PoolCard />
      <PoolCard />
      <PoolCard />
    </div>
  );
}