"use client"

import Sidebar from "@/components/custom/Sidebar"
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [role, setRole] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<string>("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        // const userRole = localStorage.getItem("userRole");
        // if (userRole) {
        //   setRole(userRole);
        // }
        setRole("staker");
      }, []);

  return (
    <>
      <main className="min-h-screen flex">
        <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        setIsOpen={toggleSidebar}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        />

        This is the dashboard page
      </main>
    </>
  )
}