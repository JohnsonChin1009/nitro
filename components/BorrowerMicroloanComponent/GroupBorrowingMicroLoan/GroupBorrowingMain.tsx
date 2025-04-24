"use client";
import React, { useState, useEffect } from "react";
import { MatchFindingEffect } from "./MatchFindingEffect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GroupBorrowingTabsDashboard from "./GroupBorrowingTabs";

const GroupBorrowingMain = () => {
  const [foundMatch, setFoundMatch] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFoundMatch(true);
    }, 6000); // 6 seconds delay

    return () => clearTimeout(timer);
  }, []); // ✅ Runs only once on mount
  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col space-y-1 mb-6 mt-3">
            <h1 className="text-3xl font-bold tracking-tight ">
              Group Borrowing Overview
            </h1>
            <p className="text-gray-500 text-[15px]">
              The place where individuals form a team to take a loan together,
              sharing responsibility for repayment of loan
            </p>
          </div>

          <Link href={"/microloan"}>
            <Button>Back To Microloan Dashboard</Button>
          </Link>
        </div>

        <div className="mt-5">
          {!foundMatch ? (
            <div className="flex flex-col space-y-5">
              <MatchFindingEffect />
              <div className="min-w-[1100px] flex justify-center">
                <div className="text-lg text-gray-600 flex justify-center items-center gap-1">
                  🔍{"Finding Your Matched Group Borrowing Group "}
                  {".......".split("").map((char, i) => (
                    <span
                      key={i}
                      className="wave"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <GroupBorrowingTabsDashboard/>
          )}
        </div>
      </div>
    </section>
  );
};

export default GroupBorrowingMain;
