"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import type { Microloan } from "@/app/interfaces/Interface"
import { formatCurrency } from "@/lib/utils"
import { LenderRewardModal } from "@/components/custom/LenderRewardsModal"

interface VoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loan: Microloan
  onVote: (vote: "approve" | "reject") => void
}

export function VoteModal({ open, onOpenChange, loan, onVote }: VoteModalProps) {
  const [selectedVote, setSelectedVote] = useState<"approve" | "reject" | null>(null)
  const [openRewardModal, setRewardModal] = useState(false);
  const handleVote = () => {
    if (selectedVote) {
      onVote(selectedVote)
      setSelectedVote(null)
      onOpenChange(false);
      setRewardModal(true);
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vote on Microloan Application</DialogTitle>
          <DialogDescription>
            {loan.applicantName} • {formatCurrency(loan.amount)} • {loan.purpose}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm mb-4">
            Based on the risk assessment and AI insights, do you approve this microloan application?
          </p>

          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedVote === "approve" ? "default" : "outline"}
              className={`flex-1 ${selectedVote === "approve" ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={() => setSelectedVote("approve")}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve
            </Button>

            <Button
              variant={selectedVote === "reject" ? "default" : "outline"}
              className={`flex-1 ${selectedVote === "reject" ? "bg-red-600 hover:bg-red-700" : ""}`}
              onClick={() => setSelectedVote("reject")}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleVote} disabled={!selectedVote}>
              Submit Vote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <LenderRewardModal
        isOpen={openRewardModal}
        onClose={ ()=>setRewardModal(false)}
        title={"Thank Your for Your Vote"}
        description={"Your vote is recorded"}
        points={20}
        experienceGained={10}
    />
    </>
  )
}