"use client";

import { useState, useEffect } from "react";

interface MainSectionProps {
  role: string;
  selectedTab: string;
}

export default function MainSection({ role, selectedTab }: MainSectionProps) {
  const [currentTab, setCurrentTab] = useState(selectedTab);
  console.log("role selected", role);
  useEffect(() => {
    setCurrentTab(selectedTab);
  }, [selectedTab]);

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <div>Dashboard content here</div>;
      case "pools":
        return <div>Pools content here</div>;
      case "profile":
        return <div>Profile content here</div>;
      case "governance":
        return <div>Governance content here</div>;
      default:
        return <div>No Tab Was Selected</div>;
    }
  };

  return (
    <section className="p-8">
      {renderContent()}
    </section>
  );
}
