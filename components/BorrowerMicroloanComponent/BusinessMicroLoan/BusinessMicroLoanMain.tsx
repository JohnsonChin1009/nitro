"use client";

import { useState } from "react";
import { CheckCircle2, CircleDollarSign, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import OverallBusinessMicroLoanCard from "./OverallBusinessMicroLoanCard";
import PaymentCard from "./PaymentCard";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { BorrowerRewardModal } from "@/components/BorrowerRewardModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BusinessMicroLoanMain = () => {
  const [openReward, setRewardModalOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [paymentMade, setPaymentMade] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const totalPhases = 3;
  const progressPercentage = (currentPhase / totalPhases) * 100;

  const phaseData = {
    1: {
      name: "Employees",
      amount: 5000,
      dueDate: "2023-07-15",
      description:
        "First phase focuses on building your core team to establish Green Earth Innovations in the Malaysian eco-friendly market.",
      strategies: [
        "Hire a product development specialist with experience in sustainable materials",
        "Bring on a part-time marketing expert focused on eco-conscious consumers",
        "Consider local university partnerships for affordable talent",
        "Implement a lean team structure with clear responsibilities",
      ],
      earningTips: [
        "Offer sustainability consulting services to established businesses",
        "Create a minimal viable product line of 2-3 eco-friendly items",
        "Secure pre-orders through local environmental networks",
        "Apply for green innovation grants from Malaysian government programs",
      ],
    },
    2: {
      name: "Equipment",
      amount: 6000,
      dueDate: "2023-10-15",
      description:
        "Second phase covers essential production equipment and technology to scale your sustainable product manufacturing.",
      strategies: [
        "Lease specialized eco-friendly production equipment instead of purchasing",
        "Invest in quality testing equipment to ensure product standards",
        "Set up a small-scale production facility in a lower-cost area",
        "Purchase energy-efficient technology to reduce operational costs",
      ],
      earningTips: [
        "Expand product line based on first phase customer feedback",
        "Establish partnerships with local retailers focused on sustainability",
        "Create a subscription model for recurring eco-product deliveries",
        "Offer production facility tours and workshops for additional revenue",
      ],
    },
    3: {
      name: "Operations",
      amount: 4000,
      dueDate: "2024-01-15",
      description:
        "Final phase supports scaling operations, expanding distribution channels, and establishing Green Earth Innovations as a leader in Malaysia's sustainable product market.",
      strategies: [
        "Optimize supply chain with local, sustainable material sources",
        "Implement inventory management system to reduce waste",
        "Develop partnerships with eco-friendly packaging suppliers",
        "Establish efficient distribution channels across Malaysia",
      ],
      earningTips: [
        "Launch an expanded product line targeting additional consumer segments",
        "Develop corporate partnership programs for bulk orders",
        "Create a customer referral program with eco-friendly incentives",
        "Explore export opportunities to neighboring Southeast Asian markets",
      ],
    },
  };

  const handleMakePayment = () => {
    setShowSuccessDialog(true);
  };

  const confirmPayment = () => {
    setPaymentMade(true);
    setShowSuccessDialog(false);

    // After a delay, move to the next phase
    setTimeout(() => {
      if (currentPhase < totalPhases) {
        setCurrentPhase(currentPhase + 1);
        setPaymentMade(false);
        setRewardModalOpen(true);
      }
    }, 1500);
  };

  const currentPhaseData = phaseData[currentPhase as keyof typeof phaseData];

  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-6 ">
            Business Microloan Overview
          </h1>
          <Link href={"/microloan"}>
            <Button>Back to MicroLoan Dashboard</Button>
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {currentPhase} of {totalPhases} Phases
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <div className="flex justify-between mt-2">
            {[1, 2, 3].map((phase) => (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    phase < currentPhase
                      ? "bg-green-100 text-green-700"
                      : phase === currentPhase
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {phase < currentPhase ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    phase
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1",
                    phase === currentPhase
                      ? "font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  Phase {phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Details and Loan Information - Side by Side with Payment Card */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Combined Business Details, Loan Summary, Phased Approach */}
          <div className="lg:col-span-2 space-y-6">
            <OverallBusinessMicroLoanCard
              currentPhase={currentPhase}
              currentPhaseData={currentPhaseData}
              phaseData={phaseData}
              paymentMade={paymentMade}
            />
          </div>

          {/* Right Column: Payment Card */}
          <div className="lg:col-span-1">
            <PaymentCard
              currentPhase={currentPhase}
              currentPhaseData={currentPhaseData}
              paymentMade={paymentMade}
              handleMakePayment={handleMakePayment}
            />
          </div>
        </div>

        {/* Phase Information Tabs */}
        <Tabs defaultValue="phase1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="phase1"
              className={currentPhase === 1 ? "font-medium" : ""}
            >
              Phase 1: Employees
            </TabsTrigger>
            <TabsTrigger
              value="phase2"
              className={currentPhase === 2 ? "font-medium" : ""}
            >
              Phase 2: Equipment
            </TabsTrigger>
            <TabsTrigger
              value="phase3"
              className={currentPhase === 3 ? "font-medium" : ""}
            >
              Phase 3: Operations
            </TabsTrigger>
          </TabsList>

          {Object.entries(phaseData).map(([phase, data]) => (
            <TabsContent key={phase} value={`phase${phase}`}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Phase {phase}: {data.name}
                  </CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-primary" />
                      Repayment Strategies
                    </h3>
                    <ul className="space-y-2 pl-6 list-disc">
                      {data.strategies.map((strategy, index) => (
                        <li key={index}>{strategy}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                      <CircleDollarSign className="h-5 w-5 text-primary" />
                      How to Earn Money
                    </h3>
                    <ul className="space-y-2 pl-6 list-disc">
                      {data.earningTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <PaymentSuccessModal
        currentPhaseData={currentPhaseData}
        showSuccessDialog={showSuccessDialog}
        setShowSuccessDialog={setShowSuccessDialog}
        currentPhase={currentPhase}
        confirmPayment={confirmPayment}
      />
      <BorrowerRewardModal
        name="An Honest Person"
        description="Awarded for paying back debt on time"
        reputationScore={25}
        contributionPoints={100}
        isOpen={openReward}
        onOpenChange={setRewardModalOpen}
        onAccept={() => setRewardModalOpen(false)}
      />
    </section>
  );
};

export default BusinessMicroLoanMain;
