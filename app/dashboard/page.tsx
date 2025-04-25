"use client"

import Sidebar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";
import MainSection from "@/components/custom/MainSection";
import { useState } from "react";

export default function DashboardPage() {
    const [selectedTab, setSelectedTab] = useState<string>("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <>
      <main className="min-h-screen flex">
        <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={toggleSidebar}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        />
        <div className="flex flex-col flex-1">
          <Header
            selectedTab={selectedTab}
            sidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <MainSection selectedTab={selectedTab} />
        </div>
      </main>
    </>
  )
}