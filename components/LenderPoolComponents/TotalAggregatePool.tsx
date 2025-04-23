"use client"

import { useState } from "react"
import { DollarSign, Plus, Sparkles, BadgePercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface AggregatePoolProps {
  totalAmount: number
  targetAmount: number
  onContribute?: (amount: number) => void
}

export default function AggregatePool({
  totalAmount = 70000,
  targetAmount = 180000,
  onContribute,
}: AggregatePoolProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState(1)
  const [conversionData, setConversionData] = useState({
    rm: 0,
    usdc: 0,
    lenderCoin: 0,
    xp: 0,
    points: 0,
    level: 0,
  })

  const handleAddFund = () => {
    setIsModalOpen(true)
    setStep(1)
    setAmount("")
  }

  const handleAmountSubmit = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return

    setStep(2)

    // Simulate conversion calculation
    setTimeout(() => {
      const rmAmount = Number.parseFloat(amount)
      const usdcAmount = rmAmount * 0.21 // Example conversion rate
      const lenderCoinAmount = usdcAmount * 1.5 // Example conversion rate
      const xpEarned = Math.floor(lenderCoinAmount * 10)
      const pointsEarned = Math.floor(lenderCoinAmount * 5)
      const newLevel = 3 // Simple level calculation

      setConversionData({
        rm: rmAmount,
        usdc: usdcAmount,
        lenderCoin: lenderCoinAmount,
        xp: xpEarned,
        points: pointsEarned,
        level: newLevel,
      })

      setStep(3)
    }, 1500)
  }

  const handleConfirm = () => {
    setStep(4)

    // Simulate processing
    setTimeout(() => {
      setStep(5) // Show rewards step
    }, 1500)
  }

  const handleComplete = () => {
    // Call the onContribute callback if provided
    if (onContribute) {
      onContribute(conversionData.rm)
    }

    setIsModalOpen(false)
    setStep(1)
  }

  const progressPercentage = Math.min(Math.round((totalAmount / targetAmount) * 100), 100)

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-md bg-primary">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl mt-2">Total Aggregate Microloan Pool</CardTitle>
          <CardDescription>Combined funds across all microloan categories</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">RM {totalAmount.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground">Target: RM {targetAmount.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Contributors</div>
                <div className="text-2xl font-semibold mt-1">1,289</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Active Microloans</div>
                <div className="text-2xl font-semibold mt-1">127</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button className="w-full" size="lg" onClick={handleAddFund}>
            <Plus className="mr-2 h-4 w-4" /> Contribute to Pool
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Contribute to Microloan Pool"}
              {step === 2 && "Converting Currency"}
              {step === 3 && "Confirm Contribution"}
              {step === 4 && "Processing..."}
              {step === 5 && "Rewards Available!"}
            </DialogTitle>
            <DialogDescription>
              {step === 1 && "Your contribution will be distributed across all microloan categories"}
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
    </>
  )
}
