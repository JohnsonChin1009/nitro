"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { name, dob });
    console.log("Wallet Address:", localStorage.getItem("walletAddress"));
    try {
      const response = await fetch("/api/mintSBT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dob,
          walletAddress: localStorage.getItem("walletAddress"), // assuming you're storing it there
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to mint SBT");
      }
  
      toast("SBT Minted Successfully!", {
        description: "tx: " + data.transactionHash,
        action: {
          label: "View",
          onClick: () => {
            window.open(`https://sepolia.scrollscan.com/tx//${data.transactionHash}`, "_blank");
          }
        }
      })

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

    } catch (error) {
      toast.error("Minting error: " + (error as Error).message);
    }
  };
  

  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <Button type="submit">Continue</Button>
        </form>
      </div>
    </main>
  );
}