"use client";

import PrivyButton from "@/components/custom/PrivyButton";
import { LayoutDashboard, UserRound, WavesLadder, Landmark, PanelLeftClose } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
    role: string;
    isOpen: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

export default function Sidebar({role, isOpen, setIsOpen, selectedTab, setSelectedTab}: SidebarProps) {
    const toggleSidebar = () => {
        if (setIsOpen) {
          setIsOpen(!isOpen);
        }
      };

    // Sidebar Layouts
    const stakerTabs = [
        { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { key: "pools", icon: WavesLadder, label: "Pools" },
        { key: "proile", icon: UserRound, label: "Profile"},
        { key: "governance", icon: Landmark, label: "Governance" }
    ]

    const borrowerTabs = [
        { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { key: "pools", icon: WavesLadder, label: "Pools" },
        { key: "profile", icon: UserRound, label: "Profile"},
        { key: "governance", icon: Landmark, label: "Governance" }
    ]

    const tabs = role === "staker" ? stakerTabs : borrowerTabs;

    return (
        <>  {/* Sidebar Wrapper */}
            <aside className={`h-screen transition-all border-r bg-card overflow-hidden ${
            isOpen ? "w-64" : "w-0"
            }`}>
                <div className="flex h-full flex-col">
                    {/* User's Image, Info with Toggle Button */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/107231772?v=4"
                                    // alt={`${username}'s profile image`}
                                    alt="Johnson's Image"
                                />
                                <AvatarFallback>JC</AvatarFallback>
                            </Avatar>
                            
                        {isOpen && (
                            <div>
                                <h2 className="font-semibold text-sm truncate max-w-28">
                                    Johnson
                                </h2>
                            </div>
                            )}
                        </div>

                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <PanelLeftClose className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation Tabs */}
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-2">
                        {tabs.map((item) => {
                        const isActive = selectedTab === item.key;
                        console.log("isActive", isActive);
                        return (
                            <Button
                            key={item.key}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start text-md"
                            onClick={() => setSelectedTab(item.key)}
                            >
                            <item.icon className="mr-3 h-4 w-4" />
                            {isOpen && item.label}
                            </Button>
                        );
                        })}
                    </nav>
                </ScrollArea>

                {/* Sidebar Footer */}
                <div className="border-t p-4 relative space-y-2">
                    <PrivyButton />
                    <p className="text-xs text-center text-gray-500">nitro © 2025</p>
                </div>
                </div>
            </aside>
        </>
    )
}