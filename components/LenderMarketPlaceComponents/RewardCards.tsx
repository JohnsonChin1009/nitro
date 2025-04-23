"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Gift, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RedeemModal from "./RedeemModal";

interface RewardCardProps {
  image: string;
  name: string;
  description: string;
  points: number;
  onClaim?: () => void;
  className?: string;
  userPoints:any;
  setUserPoints : any
}

export function RewardCard({
  image,
  name,
  description,
  points,
  className,
  userPoints,
  setUserPoints
}: RewardCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card
        className={cn(
          "relative w-75 h-85 overflow-hidden transition-all duration-500 cursor-pointer group",
          isHovered
            ? "bg-gradient-to-br from-purple-500 to-indigo-700"
            : "bg-gradient-to-br from-slate-100 to-slate-200",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Front face */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500",
            isHovered ? "opacity-0 scale-90 rotate-3" : "opacity-100"
          )}
        >
          <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-center text-slate-800">
            Mystery Reward
          </h3>
          <p className="text-sm text-center text-slate-600 mt-2">
            Hover to reveal your reward
          </p>
        </div>

        {/* Back face (revealed) */}
        <motion.div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-between p-6 text-white transition-all duration-500",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110 rotate-3"
          )}
          initial={false}
          animate={isHovered ? { y: 0 } : { y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden mb-2">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">
                {points} points required
              </span>
            </div>

            <Button
              onClick={()=>setIsModalOpen(true)}
              className="w-full bg-white text-purple-700 hover:bg-white/90 transition-all"
            >
              Redeem Reward
            </Button>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div
          className={cn(
            "absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-white/10 transition-all duration-700",
            isHovered ? "opacity-100 scale-150" : "opacity-0 scale-100"
          )}
        />
        <div
          className={cn(
            "absolute -top-8 -left-8 w-16 h-16 rounded-full bg-white/10 transition-all duration-700",
            isHovered ? "opacity-100 scale-150" : "opacity-0 scale-100"
          )}
        />
      </Card>
      {/*Redeem Modal*/}
      <RedeemModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedReward={name} userPoints={userPoints} rewardPoints = {points}
      setUserPoints = {setUserPoints}
      />
    </>
  );
}
