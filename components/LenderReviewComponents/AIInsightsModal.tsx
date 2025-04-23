"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, BarChart } from "lucide-react"
import type { Microloan } from "@/interfaces/Interface"
import { formatCurrency } from "@/lib/utils"

interface AIInsightsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan: Microloan
  isGenerating: boolean
}

export function AIInsightsModal({ open, onOpenChange, loan, isGenerating }: AIInsightsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            AI Insights for {loan.applicantName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Loan Amount:</span>
              <span className="font-medium">{formatCurrency(loan.amount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Purpose:</span>
              <span className="font-medium">{loan.purpose}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span>Risk Score:</span>
              <span className="font-medium">{loan.riskScore}/10</span>
            </div> */}
          </div>

          <div className="border rounded-lg p-4 mb-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Generating AI insights...</p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-medium mb-2">Analysis:</h3>
                <p className="text-sm text-muted-foreground">
                  {loan.aiInsights || "No insights available yet. Please generate insights first."}
                </p>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
