"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
    wallet_address: string;
    username: string
    avatar_url: string;
}

interface UserContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
  
    const router = useRouter();
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/getSupabaseData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: localStorage.getItem("walletAddress")}),
          });
  
          if (!res.ok) throw new Error("Failed to fetch profile");
  
          const response = await res.json();
          const data = response.data.userData;
          setUser(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          router.push("/sign-up"); // or login route
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [router]);
  
    return (
      <UserContext.Provider value={{ user, setUser, loading }}>
        {children}
      </UserContext.Provider>
    );
  };