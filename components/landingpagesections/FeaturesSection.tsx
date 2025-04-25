"use client";
import React from "react";
import { Zap, Shield, BarChart } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeatureSection = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Reputation Scoring",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "AI-driven  Advisory & Analysis",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Gamification & Education",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Incentive-based Stake Pooling",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "DAO Voting & Community",
      },
      {
        icon: <BarChart className="h-6 w-6" />,
        title: "AI Assistant in Interest Rate Decision & Risk Scoring",
      },
  ];
  return (
    <section className="bg-white min-h-[880px] bg-gradient-to-b from-[#d3dbf9] to-[#FFFFFF] py-18 overflow-x-clip">
      <div className="px-5 py-2 flex flex-col">
        <div className="max-w-[850px] mx-auto my-6">
          <div className="flex flex-col justify-between items-center">
            <div className="tag">Features</div>

            <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
              Explore the Amazing Features Our Platform Offers{" "}
            </h2>
          </div>
        </div>
        {/*Feature Section*/}
        <div className="min-w-[900px] flex justify-center items-center mt-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              index={index}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;