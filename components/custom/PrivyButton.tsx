"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PrivyButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("walletAddress");
    router.refresh();
  };

  // Redirect to dashboard if user is authenticated and on the homepage
  useEffect(() => {
    if (pathname !== "/") return;
    
    const checkAndRedirect = async () => {
      if (authenticated && user?.wallet?.address) {
        localStorage.setItem("walletAddress", user.wallet.address);
        
        try {
          const res = await fetch("/api/checkUserSBT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress: user.wallet.address }),
          });
          const { hasToken } = await res.json();
  
          // If they don't have the SBT yet, send to sign-up
          if (!hasToken) {
            router.replace("/sign-up");
            return;
          }
        } catch (err) {
          console.error("Failed to check SBT status", err);
          // Optionally handle the error: show a toast or fallback
        }
  
        // They have the SBT, store and go to dashboard
        router.replace("/dashboard");
      }
    };
  
    checkAndRedirect();
  }, [router, authenticated, user, pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!ready) {
    return <p>Loading...</p>;
  }

  return authenticated ? (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full border-2 border-gray-300 hover:border-2 px-4 py-2 text-[13px] flex items-center justify-center gap-2 rounded-xl hover:border-[#2C2C2C] duration-200">
        {/* Green Dot */}
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        {user?.wallet?.address
        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
            -4
          )}`
        : "Menu"}      
      </button>
      {dropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50 hover:-translate-y-1 duration-300 hover:border-[#2c2c2c]">
            <button
              onClick={handleLogout}
              className="block w-full px-3 py-2 text-center hover:font-semibold"
            >
              Disconnect
            </button>
          </div>
        )}
    </div>
  ) : (
    <button onClick={login}>
      Connect Wallet
    </button>
  );
}

{/*
  const checkAndRedirect = async () => {
      if (authenticated && user?.wallet?.address) {
        try {
          const hasNFT = await contract.hasRoleNFT(user.wallet.address);

          if (!hasNFT) {
            router.replace("/sign-up");
            return;
          }

          const role = await contract.getUserRole(user.wallet.address);
          localStorage.setItem("userRole", role);
          localStorage.setItem("walletAddress", user.wallet.address);
          router.replace("/dashboard");
          } catch (error) {
            console.error("Error during login with Privy:", error);
          }
        }
      }

      checkAndRedirect();
    }, [authenticated, user, contract, router, pathname])
  */}