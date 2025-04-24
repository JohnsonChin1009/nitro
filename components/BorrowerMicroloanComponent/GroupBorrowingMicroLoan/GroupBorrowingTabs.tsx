"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HistoryTab from "./HistoryTab"
import OverviewTab from "./OverviewTab"
import MembersTab from "./MembersTab"
import CommunityTab from "./CommunityTab"

export default function GroupBorrowingTabsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <section className="py-1 min-h-screen min-w-[1100px]">
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab/>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <MembersTab/>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistoryTab/>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <CommunityTab/>
        </TabsContent>
      </Tabs>
    </section>
  )
}

