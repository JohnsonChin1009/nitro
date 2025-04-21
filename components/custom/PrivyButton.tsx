"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PrivyButton() {
    const { ready, authenticated, login, logout, user } = usePrivy();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("walletAddress");
        router.refresh();
    }

    // Redirect to dashboard if user is authenticated and on the homepage
    useEffect(() => {
        if (pathname !== "/") return;

        const checkAndRedirect = async () => {
        if (authenticated && user?.wallet?.address) {
            localStorage.setItem("walletAddress", user.wallet.address);
            router.replace("/dashboard");
        }

        }
    
        checkAndRedirect(); 
    }, [router, authenticated, user, pathname]);

    if (!ready) {
        return <p>Loading...</p>;
    };

    return (
        <div className="flex items-center gap-4">
        {!authenticated ? (
            <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={login}
            >
            Connect Wallet
            </button>
        ) : (
            <>
            <div className="text-sm text-gray-700">
                Logged in as {user?.wallet?.address.slice(0, 6)}...
                {user?.wallet?.address.slice(-4)}
            </div>
            <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleLogout}
            >
                Logout
            </button>
            </>
        )}
        </div>
    );
}