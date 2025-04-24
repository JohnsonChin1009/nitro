"use client";
import { useState } from "react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PetComponent from "@/components/BorrowerReputationComponent/PetComponent";
import InventoryTab from "@/components/BorrowerReputationComponent/InventoryTab";
import AnalysisTab from "@/components/BorrowerReputationComponent/AnalysisTab";
import ReputationOverviewTab from "@/components/BorrowerReputationComponent/ReputationOverviewTab";
import ReputationHistoryTab from "@/components/BorrowerReputationComponent/ReputationHistoryTab";

const MyReputation = () => {
     const [petState, setPetState] = useState({
        reputationScore: 650,
        level: 3,
        levelProgress: 65,
        happiness: 75,
        strength: 60,
        equippedAccessory: "bow-tie",
      })
    const [images, setImages] = useState(`/petcat.png?height=180&width=180`)
  return (
    <section className=" py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <div className="flex flex-col space-y-2 py-3">
        <h1 className="text-3xl font-bold ">
          My Financial Pet Reputation
        </h1>
        <p>Your Reputation Score As Your Financial Pet Cat </p>
        </div>
       

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Pet Stats */}
          <div className="md:col-span-4">
            <PetComponent petState = {petState} setPetState = {setPetState} image = {images}/>
          </div>

          {/* Right Column - Tabs */}
          <div className="md:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ReputationOverviewTab/>
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryTab petState = {petState} setPetState = {setPetState} setPetImage = {setImages}/>
              </TabsContent>

              <TabsContent value="history">
                <ReputationHistoryTab/>`
              </TabsContent>

              <TabsContent value="analysis">
                <AnalysisTab/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyReputation;
