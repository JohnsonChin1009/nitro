"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, CircleDollarSign, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import OverallBusinessMicroLoanCard from "./OverallBusinessMicroLoanCard"
import PaymentCard from "./PaymentCard"
import PaymentSuccessModal from "./PaymentSuccessModal"
import { BorrowerRewardModal } from "@/components/BorrowerRewardModal"
import { generateRepaymentStrategies } from "@/lib/gemini"

const BusinessMicroLoanMain = () => {
  const [openReward, setRewardModalOpen] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(1)
  const [paymentMade, setPaymentMade] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  type PhaseDetails = {
    name: string
    amount: number
    dueDate: string
    description: string
    strategies: string[]
    earningTips: string[]
  }
  
  const [phaseData, setPhaseData] = useState<Record<number, PhaseDetails> | null>(null)

  const totalPhases = phaseData ? Object.keys(phaseData).length : 3
  const progressPercentage = (currentPhase / totalPhases) * 100

  useEffect(() => {
    const fetchPhases = async () => {
      console.log("🚀 Fetching Gemini business strategy...")
      const data = await generateRepaymentStrategies("Medium")
      if (data) {
        console.log("✅ Gemini response:", data)
        const structured: Record<number, PhaseDetails> = {}

        for (let i = 0; i < data.numberOfPhases; i++) {
          structured[i + 1] = {
            name: data.phaseTitles[i],
            amount: data.amounts[i],
            dueDate: new Date(Date.now() + data.dueDays[i] * 86400000).toISOString().split("T")[0],
            description: data.descriptions[i],
            strategies: data.repaymentStrategies?.[i] ?? ["No strategy tips available"],
            earningTips: data.earningTips?.[i] ?? ["No income tips available"],
          }
        }

        setPhaseData(structured)
      }
    }

    fetchPhases()
  }, [])

  const handleMakePayment = () => {
    setShowSuccessDialog(true)
  }

  const confirmPayment = () => {
    setPaymentMade(true)
    setShowSuccessDialog(false)

    setTimeout(() => {
      if (currentPhase < totalPhases) {
        setCurrentPhase(currentPhase + 1)
        setPaymentMade(false)
        setRewardModalOpen(true)
      }
    }, 1500)
  }

  if (!phaseData || !phaseData[currentPhase]) {
    return <div className="p-10 text-center text-muted-foreground">⏳ Loading repayment strategy from Gemini...</div>
  }
  
  const currentPhaseData = phaseData[currentPhase]

  return (
    <section className="py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">Business Microloan Overview</h1>

        {/* Progress & Timeline */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {currentPhase} of {totalPhases} Phases
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <div className="flex justify-between mt-2">
            {[...Array(totalPhases)].map((_, i) => {
              const phase = i + 1
              return (
                <div key={phase} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      phase < currentPhase
                        ? "bg-green-100 text-green-700"
                        : phase === currentPhase
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {phase < currentPhase ? <CheckCircle2 className="h-5 w-5" /> : phase}
                  </div>
                  <span
                    className={cn("text-xs mt-1", phase === currentPhase ? "font-medium" : "text-muted-foreground")}
                  >
                    Phase {phase}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Layout: Summary + Payment */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OverallBusinessMicroLoanCard currentPhase={currentPhase} currentPhaseData={currentPhaseData} phaseData={phaseData} paymentMade={paymentMade} />
          </div>
          <div className="lg:col-span-1">
            <PaymentCard currentPhase={currentPhase} currentPhaseData={currentPhaseData} paymentMade={paymentMade} handleMakePayment={handleMakePayment} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="phase1">
          <TabsList className={`grid w-full grid-cols-${totalPhases}`}>
          {Object.entries(phaseData).map(([phase, data]: [string, PhaseDetails]) => (
              <TabsTrigger key={phase} value={`phase${phase}`} className={+phase === currentPhase ? "font-medium" : ""}>
                Phase {phase}: {data.name}
              </TabsTrigger>
            ))}
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
                      {data.strategies.map((strategy: string, index: number) => (
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
                      {data.earningTips.map((tip: string, index: number) => (
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
  )
}

export default BusinessMicroLoanMain
