"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributionPointCard } from "@/components/BorrowerShopComponents/ContributionPointsCard";
import { AuroraText } from "@/components/magicui/aurora-text";
import PetAssetTab from "@/components/BorrowerShopComponents/PetAssetTab";
import SwagTab from "@/components/BorrowerShopComponents/SwagTab";

const Shop = () => {
  const [contributionpoints, setContributionPoints] = useState(1250);
  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center mt-2">
        <div className="flex justify-between mb-2">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Reward <AuroraText>Marketplace</AuroraText>{" "}
            </h1>
            <p className="text-[15px] text-shadow-gray-500 font-semibold">
              Exchange Your Contribution Points to Redeem Swags 🕶️ and <br />{" "}
              In-Game Assets to Grow Your Financial Reputation Pet🐱
            </p>
          </div>
          <div>
            <ContributionPointCard userPoints={contributionpoints} />
          </div>
        </div>
        <hr className="my-3" />
        <div className="my-2">
          <Tabs defaultValue="asset" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="asset">Pet Assets</TabsTrigger>
              <TabsTrigger value="swag">Swag</TabsTrigger>
            </TabsList>

            <PetAssetTab contributionPoint = {contributionpoints} setUserContributionPoint = {setContributionPoints} />
            <SwagTab  contributionPoint = {contributionpoints} setUserContributionPoint = {setContributionPoints} />
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Shop;
