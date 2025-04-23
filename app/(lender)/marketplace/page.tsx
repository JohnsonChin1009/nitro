"use client";

import { useState } from "react";
import React from "react";
import {
  Gift,
  ShirtIcon as TShirt,
  Coffee,
  Headphones,
} from "lucide-react";
import { Reward } from "@/interfaces/Interface";
import { PointsCard } from "@/components/LenderMarketPlaceComponents/PointsCard";
import { RewardCard } from "@/components/LenderMarketPlaceComponents/RewardCards";

const MarketPlace = () => {
    const rewards = [
        {
          id: 1,
          image: "/tshirt.png?height=200&width=200",
          name: "Nitro T-Shirt",
          description: "Premium cotton T-Shirt with Nitro Logo (Limited Edition)",
          points: 200,
        },
        {
          id: 2,
          image: "/giftcoupon.png?height=200&width=200",
          name: "Gift Card",
          description: "$25 gift card for your favorite store",
          points: 300,
        },
        {
          id: 3,
          image: "/coffeemug.png?height=200&width=200",
          name: "Coffee Mug",
          description: "Coffee Mug with Nitro Logo (Limited Edition)",
          points: 300,
        },
        {
            id: 4,
            image: "/moremoney.png?height=200&width=200",
            name: "Wireless HeadPhone",
            description: "High Quality Wireless Headphone",
            points: 300,
        },
        {
            id: 5,
            image: "/giftcoupon.png?height=200&width=200",
            name: "RichMan Coupon",
            description: "Received Increase in Returns Rate for two days",
            points: 1200,
        },
        {
            id: 6,
            image: "/hoodie.png?height=200&width=200",
            name: "Nitro Hoodie",
            description: "High Quality Nitro Hoodie",
            points: 300,
        },
      
      ]
  const [userPoints, setUserPoints] = useState(1000);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemQuantity, setRedeemQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <main className="px-[50px] py-5 min-h-screen">
      <div className="min-w-[1200px]">
        <div className="mb-5 flex flex-row justify-between items-start">
          <div >
            <h1 className="text-3xl font-bold mb-2">Today's Claimable Rewards</h1>
            <p className="text-muted-foreground">Redeem Your Points For Exclusive Perks and Swag</p>
          </div>
            <PointsCard userPoints = {userPoints}/>
        </div>
      </div>
      <hr/>
      {/*Rewards Content*/}
      <div className="grid grid-cols-4 gap-6 mt-6 px-5">
      {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            image={reward.image}
            name={reward.name}
            description={reward.description}
            points={reward.points}
            userPoints = {userPoints}
            setUserPoints = {setUserPoints}
          />
        ))}
      </div>

     
    </main>
  );
};

export default MarketPlace;
