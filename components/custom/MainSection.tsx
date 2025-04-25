"use client";

import { useState, useEffect } from "react";
import DashboardSection from "@/components/custom/DashboardSection";
import PoolSection from "@/components/custom/PoolSection";
import ProfileSection from "@/components/custom/ProfileSection";
import GovernanceSection from "@/components/custom/GovernanceSection";

interface MainSectionProps {
  selectedTab: string;
}

export default function MainSection({ selectedTab }: MainSectionProps) {
  const [currentTab, setCurrentTab] = useState(selectedTab);
  
  useEffect(() => {
    setCurrentTab(selectedTab);
  }, [selectedTab]);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardSection />;
      case "pools":
        return <PoolSection />;
      case "profile":
        return <ProfileSection />;
      case "governance":
        return <GovernanceSection />;
      default:
        return <div>No Tab Was Selected</div>;
    }
  };

  return (
    <section className="p-6">
      {renderContent()}
    </section>
  );
}
