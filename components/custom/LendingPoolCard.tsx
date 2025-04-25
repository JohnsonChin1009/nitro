"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface LendingPoolProps {
    poolAddress: string;
}

export default function LendingPoolCard({ poolAddress }: LendingPoolProps) {

    // Get specific pool info
    useEffect(() => {
        async function fetchLendingPoolData() {
            try {
                const response = await fetch("/api/fetchLendingPool", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ poolAddress }),
                })
    
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
    
                const data = await response.json();
                console.log("Fetched lending pool data: ", data);
            } catch (error: unknown) {
                console.error('Error fetching lending pool:', error);
                toast("Fetched failed");
            }
        }
        
        fetchLendingPoolData();
    }, [poolAddress]);
    return (
        <>
        
        </>
    )
}