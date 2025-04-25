"use client";

import { useState } from "react";
import PrivyButton from "@/components/custom/PrivyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

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
  
      console.log("Minting success:", data);
      // Optionally redirect or notify user here
    } catch (error) {
      console.error("Minting error:", error);
      // Optionally show an error toast or message
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
        <PrivyButton />
      </div>
    </main>
  );
}