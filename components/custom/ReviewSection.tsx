"use client";
import { LoanStatisticsCard } from "@/components/custom/MicroLoanStatistics";
import React from "react";
import { mockMicroloans } from "@/app/mockData/mockData";
import { useState } from "react";
import { MicroLoanCard } from "@/components/custom/MicroLoanCard";

const Reviews = () => {

    const [microloans, setMicroloans] = useState(mockMicroloans)

    const handleVote = (id: string, vote: "approve" | "reject") => {
      setMicroloans(
        microloans.map((loan) => {
          if (loan.id === id) {
            return {
              ...loan,
              votes: {
                ...loan.votes,
                [vote]: loan.votes[vote] + 1,
                total: loan.votes.total + 1,
              },
            }
          }
          return loan
        }),
      )
    }
  
    const handleGenerateInsights = (id: string, insights: string) => {
      setMicroloans(
        microloans.map((loan) => {
          if (loan.id === id) {
            return {
              ...loan,
              aiInsights: insights,
            }
          }
          return loan
        }),
      )
    }
  return (
    <section className=" py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center mt-2">
        <div className="my-2">
          <LoanStatisticsCard />
        </div>
        <div className="flex flex-col mt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              High Risk Microloans
            </h1>
            <p className="text-muted-foreground mt-2">
              Review and vote on high-risk microloan applications
            </p>
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-4">
          {microloans.map((loan) => (
        <MicroLoanCard key={loan.id} loan={loan} onVote={handleVote} onGenerateInsights={handleGenerateInsights} />
      ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;