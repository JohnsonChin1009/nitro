"use client"

import { useState, useEffect } from "react";
import { PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    selectedTab: string;
    sidebarOpen?: boolean;
    toggleSidebar?: () => void;
}

export default function Header({selectedTab, sidebarOpen, toggleSidebar}: HeaderProps) {
    const [currentTab, setCurrentTab] = useState(selectedTab);

    useEffect(() => {
        setCurrentTab(selectedTab.toUpperCase());
    }, [selectedTab]);

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
                <h1 className="text-xl font-bold">{currentTab}</h1>
            </div>
            </div>
        </header>
    )
}