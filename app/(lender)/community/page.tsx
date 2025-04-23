import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionTab from "@/components/LenderCommunityComponents/DiscussionTab";
import ActionVotingTab from "@/components/LenderCommunityComponents/ActionVotingTab";
import InterestRateTab from "@/components/LenderCommunityComponents/InterestRateTab";

const Community = () => {
  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center mt-2">
        <h1 className="text-3xl font-bold mb-8">Community Portal</h1>
        <div className="mt-1">
          <Tabs defaultValue="discussion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="action-voting">Action Voting</TabsTrigger>
              <TabsTrigger value="interest-rate">Interest Rate</TabsTrigger>
            </TabsList>

            <TabsContent value="discussion">
              <DiscussionTab/>
            </TabsContent>

            <TabsContent value="action-voting">
              <ActionVotingTab/>
            </TabsContent>

            <TabsContent value="interest-rate">
              <InterestRateTab/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Community;
