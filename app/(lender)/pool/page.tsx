"use client";
import AggregatePool from "@/components/LenderPoolComponents/TotalAggregatePool";
import { useState } from "react";
import {
  BadgePercent,
  BookOpen,
  Briefcase,
  Home,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MicroLoanPoolCard from "@/components/LenderPoolComponents/MicroLoanPoolCard";


const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [conversionData, setConversionData] = useState({
    rm: 0,
    usdc: 0,
    lenderCoin: 0,
    xp: 0,
    points: 0,
    level: 0,
  });

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalApplications: 342,
    totalContributors: 1289,
    totalContributed: 70000,
  });

  // State for loan pools
  const [loanPools, setLoanPools] = useState([
    {
      id: "education",
      title: "Education Micrloan Fund Pool",
      description: "Help students achieve their academic goals",
      icon: BookOpen,
      current: 15000,
      target: 50000,
      color: "bg-blue-500",
      activeLoans: 28,
      avgLoanSize: 2500,
    },
    {
      id: "business",
      title: "Business Startup Micrloan Fund Pool",
      description: "Support entrepreneurs building new businesses",
      icon: Briefcase,
      current: 25000,
      target: 40000,
      color: "bg-green-500",
      activeLoans: 42,
      avgLoanSize: 5000,
    },
    {
      id: "personal",
      title: "Personal Needs Micrloan Fund Pool",
      description: "Assist individuals with personal financial needs",
      icon: ShoppingBag,
      current: 10000,
      target: 30000,
      color: "bg-purple-500",
      activeLoans: 35,
      avgLoanSize: 1800,
    },
    {
      id: "housing",
      title: "Housing Improvement Micrloan Fund Pool",
      description: "Help families improve their living conditions",
      icon: Home,
      current: 20000,
      target: 60000,
      color: "bg-orange-500",
      activeLoans: 22,
      avgLoanSize: 4200,
    },
  ]);

  const handleAddFund = (poolId: string) => {
    setSelectedPool(poolId);
    setIsModalOpen(true);
    setStep(1);
    setAmount("");
  };

  const handleAmountSubmit = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return;

    setStep(2);

    // Simulate conversion calculation
    setTimeout(() => {
      const rmAmount = Number.parseFloat(amount);
      const usdcAmount = rmAmount * 0.21; // Example conversion rate
      const lenderCoinAmount = usdcAmount * 1.5; // Example conversion rate
      const xpEarned = Math.floor(lenderCoinAmount * 10);
      const pointsEarned = Math.floor(lenderCoinAmount * 5);
      const newLevel =  3; // Simple level calculation

      setConversionData({
        rm: rmAmount,
        usdc: usdcAmount,
        lenderCoin: lenderCoinAmount,
        xp: xpEarned,
        points: pointsEarned,
        level: newLevel,
      });

      setStep(3);
    }, 1500);
  };

  const handleConfirm = () => {
    setStep(4);

    // Simulate processing
    setTimeout(() => {
      setStep(5); // Show rewards step
    }, 1500);
  };

  const handleComplete = () => {
    // Update the pool's current amount
    if (selectedPool) {
      const updatedPools = loanPools.map((pool) => {
        if (pool.id === selectedPool) {
          return {
            ...pool,
            current: pool.current + conversionData.rm,
          };
        }
        return pool;
      });

      setLoanPools(updatedPools);

      // Update total contributed
      setStats({
        ...stats,
        totalContributors: stats.totalContributors + 1,
        totalContributed: stats.totalContributed + conversionData.rm,
      });
    }

    setIsModalOpen(false);
    setStep(1);
  };

  const currentPool = selectedPool
    ? loanPools.find((pool) => pool.id === selectedPool)
    : null;

  // Calculate total contributed across all pools
  const totalPoolContributions = loanPools.reduce(
    (sum, pool) => sum + pool.current,
    0
  );

  // Calculate total target across all pools
  const totalPoolTarget = loanPools.reduce((sum, pool) => sum + pool.target, 0)

  // Handle contribution to the aggregate pool
  const handleAggregateContribution = (amount: number) => {
    // Distribute the contribution proportionally across all pools
    const updatedPools = loanPools.map((pool) => {
      const proportion = pool.target / totalPoolTarget
      const poolContribution = amount * proportion

      return {
        ...pool,
        current: pool.current + poolContribution,
      }
    })

    setLoanPools(updatedPools)
  }

  const handleAddFund1 = (poolId: string) => {
    // This would open the modal for individual pool contributions
    console.log(`Add fund to pool: ${poolId}`)
  }
  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
        <div className="px-[50px] w-full flex flex-col justify-center mt-2">
        {/*Title*/}
        <div className="flex flex-col space-y-2 mt-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Microloan Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your contributions and track pool progress
          </p>
        </div>

        {/*Main Content*/}
        <div className="mt-5 min-w-[1200px]">

           {/* Aggregate Pool Card */}
           <div className="mb-8 mt-6">
            <AggregatePool
              totalAmount={totalPoolContributions}
              targetAmount={totalPoolTarget}
              onContribute={handleAggregateContribution}
            />
          </div>
          
      <div>
        <h2 className="text-xl font-semibold mb-4 mt-4">Available MicroLoan Pools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {loanPools.map((pool, key) => (
            <MicroLoanPoolCard key = {key} pool={pool} handleAddFund = {handleAddFund}/>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Add Funds"}
              {step === 2 && "Converting Currency"}
              {step === 3 && "Confirm Contribution"}
              {step === 4 && "Processing..."}
              {step === 5 && "Rewards Available!"}
            </DialogTitle>
            <DialogDescription>
              {step === 1 && `Contributing to ${currentPool?.title}`}
              {step === 2 && "Please wait while we convert your currency"}
              {step === 3 && "Review your contribution details"}
              {step === 4 && "Finalizing your contribution"}
              {step === 5 && "Complete your contribution to earn these rewards"}
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (RM)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount in RM"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAmountSubmit}>Continue</Button>
              </DialogFooter>
            </>
          )}

          {step === 2 && (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-center text-sm text-muted-foreground">Converting RM to USDC to LenderCoin...</p>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Amount (RM)</span>
                    <span className="font-medium">RM {conversionData.rm.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>USDC Equivalent</span>
                    <span className="font-medium">${conversionData.usdc.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>LenderCoin</span>
                    <span className="font-medium">{conversionData.lenderCoin.toFixed(2)} LC</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleConfirm}>Confirm Contribution</Button>
              </DialogFooter>
            </>
          )}

          {step === 4 && (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-center text-sm text-muted-foreground">Processing your contribution...</p>
            </div>
          )}

          {step === 5 && (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">Rewards Available!</h3>
                    <p className="text-muted-foreground">Complete your contribution to earn:</p>
                  </div>

                  <div className="w-full space-y-4 pt-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="flex items-center">
                        <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
                        XP to Earn
                      </span>
                      <span className="font-medium">+{conversionData.xp} XP</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="flex items-center">
                        <BadgePercent className="h-4 w-4 text-green-500 mr-1" />
                        Contribution Points
                      </span>
                      <span className="font-medium">+{conversionData.points} points</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span>Level Progress</span>
                      <span className="font-medium">Level {conversionData.level}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleComplete}>Complete Contribution</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>          
        </div>   
        </div> 
    </section>
  );
};

export default Dashboard;