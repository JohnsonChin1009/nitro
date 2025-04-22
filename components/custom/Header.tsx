"use client"

import { PanelRightClose, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
    role: string;
    selectedTab: string;
    sidebarOpen?: boolean;
    toggleSidebar?: () => void;
}

export default function Header({role, selectedTab, sidebarOpen, toggleSidebar}: HeaderProps) {
    const [currentTab, setCurrentTab] = useState(selectedTab);

    useEffect(() => {
      setCurrentTab(selectedTab.toUpperCase());
    }, [selectedTab]);

    const rightArea = role === "staker" ? <StakerRightArea /> : <BorrowerRightArea />;

    return (
        <header className="sticky border-b bg-background w-full">
            <div className="flex items-center justify-between p-6 min-h-20">
            {/* Sidebar Toggle + Section Title */}
            <div className="flex items-center gap-3">
                {!sidebarOpen && toggleSidebar && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
                    <PanelRightClose />
                </Button>
                )}
                <h1 className="text-xl font-black">{currentTab}</h1>
            </div>
            <div className="flex items-center gap-3">
                {rightArea}
            </div>
            </div>
        </header>
    )
}

const StakerRightArea = () => {
    return (
        <>
            <Button className="font-bold">
                Stake
                <BadgePlus className="w-8 h-8" />
            </Button>
        </>
    )
}

const BorrowerRightArea = () => {
    return (
        <div>

        </div>
    )
}