"use client"
import React, { useState } from "react"
import axios from "axios"               
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ThumbsUp, ThumbsDown, BarChart } from "lucide-react"
import { formatCurrency, calculateTimeLeft } from "@/lib/utils"
import type { Microloan } from "@/interfaces/Interface"
import { VoteModal } from "./VoteModal"
import { AIInsightsModal } from "./AIInsightsModal"

interface MicroloanCardProps {
  loan: Microloan
  onVote: (id: string, vote: "approve" | "reject") => void
  onGenerateInsights: (id: string, insights: string) => void
}

export function MicroloanCard({
  loan,
  onVote,
  onGenerateInsights,
}: MicroloanCardProps) {
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showInsightsModal, setShowInsightsModal] = useState(false)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  const approvalPercentage = Math.round(
    (loan.votes.approve / (loan.votes.total || 1)) * 100
  )
  const timeLeft = calculateTimeLeft(loan.endDate)

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true)
    setShowInsightsModal(true)

    try {
     
      const payload = {
        features: {
          StatedMonthlyIncome:    loan.StatedMonthlyIncome,
          DebtToIncomeRatio:      loan.DebtToIncomeRatio,
          DelinquenciesLast7Years: loan.DelinquenciesLast7Years,
          CreditGrade:            loan.CreditGrade,
          ProsperRatingAlpha:     loan.ProsperRatingAlpha,
          BorrowerState:          loan.BorrowerState,
          Occupation:             loan.Occupation,
          EmploymentStatus:       loan.EmploymentStatus,
          IncomeRange:            loan.IncomeRange,
          amount:                 loan.amount,                // if still used
        },
      }

      // === CALL YOUR FASTAPI ENDPOINT ===
      const { data } = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload
      )

      // === FEED THE RETURNED SCORE INTO YOUR UI ===
      const score = data.predicted_score
      onGenerateInsights(loan.id, `AI Risk Score: ${score}/10`)
    } catch (err) {
      console.error("AI call failed:", err)
      onGenerateInsights(loan.id, "AI call failed")
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{loan.applicantName}</CardTitle>
            <Badge variant={"destructive"} className="ml-2">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Risk: {loan.riskScore}/10
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {formatCurrency(loan.amount)} • {loan.purpose}
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Risk Factors:</h4>
              <p className="text-sm text-muted-foreground">
                {loan.riskExplanation}
              </p>
            </div>

            {loan.aiInsights && (
              <div>
                <h4 className="font-medium mb-1">AI Insights:</h4>
                <p className="text-sm text-muted-foreground">
                  {loan.aiInsights}
                </p>
              </div>
            )}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Voting Progress</span>
                <span>{loan.votes.total} votes</span>
              </div>
              <Progress value={approvalPercentage} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
                  {loan.votes.approve} approve
                </span>
                <span className="flex items-center">
                  <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
                  {loan.votes.reject} reject
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Time left: </span>
              <span className="font-medium">{timeLeft}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowVoteModal(true)}
          >
            Vote
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {loan.aiInsights ? "View Insights" : "Generate Insights"}
          </Button>
        </CardFooter>
      </Card>

      <VoteModal
        open={showVoteModal}
        onOpenChange={setShowVoteModal}
        loan={loan}
        onVote={(v) => {
          onVote(loan.id, v)
          setShowVoteModal(false)
        }}
      />

      <AIInsightsModal
        open={showInsightsModal}
        onOpenChange={setShowInsightsModal}
        loan={loan}
        isGenerating={isGeneratingInsights}
      />
    </>
  )
}