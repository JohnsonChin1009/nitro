"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalMicroLoanInfo from "./PersonalMicroLoanInfo";
import SuggestRepaymentStrategyTab from "./SuggestRepaymentStrategyTab";
import SuggestedRepaymentScheduleTab from "./SuggestedRepaymentScheduleTab";
import SimulatorTab from "./SimulatorTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PersonalMicroLoan = ({ data }: any) => {
  // State for payment simulator
  const [paymentAmount, setPaymentAmount] = useState(227.53);
  const [newTerm, setNewTerm] = useState(15);
  const [interestSaved, setInterestSaved] = useState(345.67);
  const [payoffDate, setPayoffDate] = useState("Aug 2026");
  const [monthsSaved, setMonthsSaved] = useState(9);
  const [percentSaved, setPercentSaved] = useState(15);

  // Calculate loan details when payment amount changes
  useEffect(() => {
    // Simple calculation for demonstration purposes
    const basePayment = 227.53;
    const baseTerm = 24;
    const baseInterest = 450;

    // Calculate new term based on increased payment
    const ratio = basePayment / paymentAmount;
    const calculatedTerm = Math.max(Math.round(baseTerm * ratio), 1);
    setNewTerm(calculatedTerm);

    // Calculate months saved
    const calculatedMonthsSaved = Math.max(baseTerm - calculatedTerm, 0);
    setMonthsSaved(calculatedMonthsSaved);

    // Calculate interest saved (simplified)
    const calculatedInterestSaved =
      baseInterest - (baseInterest * calculatedTerm) / baseTerm;
    setInterestSaved(Math.round(calculatedInterestSaved * 100) / 100);
    setPercentSaved(Math.round((calculatedInterestSaved / baseInterest) * 100));

    // Calculate new payoff date
    const today = new Date();
    today.setMonth(today.getMonth() + calculatedTerm);
    setPayoffDate(
      `${today.toLocaleString("default", {
        month: "short",
      })} ${today.getFullYear()}`
    );
  }, [paymentAmount]);

  // Handle payment amount change
  const handlePaymentChange = (value: number[]) => {
    setPaymentAmount(value[0]);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    if (!isNaN(value) && value >= 100 && value <= 500) {
      setPaymentAmount(value);
    }
  };

  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-6">Personal Microloan</h1>
          <Link href={"/microloan"}>
            <Button>Back to MicroLoan Dashboard</Button>
          </Link>
        </div>

        {/* Loan Details and Progress Card */}
        <PersonalMicroLoanInfo data={data} />

        {/* Repayment Information Tabs */}
        <Tabs defaultValue="strategy" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategy">AI-Generated Strategy</TabsTrigger>
            <TabsTrigger value="schedule">Repayment Schedule</TabsTrigger>
            <TabsTrigger value="simulator">Payment Simulator</TabsTrigger>
          </TabsList>
          <SuggestRepaymentStrategyTab />
          <SuggestedRepaymentScheduleTab />
          <SimulatorTab
            paymentAmount={paymentAmount}
            handlePaymentChange={handlePaymentChange}
            handleInputChange={handleInputChange}
            newTerm={newTerm}
            monthsSaved={monthsSaved}
            interestSaved={interestSaved}
            percentSaved={percentSaved}
            payoffDate={payoffDate}
          />
        </Tabs>
      </div>
    </section>
  );
};

export default PersonalMicroLoan;
