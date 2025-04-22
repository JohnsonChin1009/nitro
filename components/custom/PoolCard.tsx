"use client";

export default function PoolCard() {
  return (
    <div className="bg-card border border-gray-200 shadow-sm rounded-2xl p-6 w-full max-w-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800">📦 Nitro Growth Pool</h2>
        <p className="text-sm text-gray-600">
          A stable pool optimized for microloan disbursement in Malaysia.
        </p>

        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div>
            <span className="font-medium">APY:</span> 12.4%
          </div>
          <div>
            <span className="font-medium">TVL:</span> 145,000 MYR
          </div>
        </div>

        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl">
          Join Pool
        </button>
      </div>
    </div>
  );
}
