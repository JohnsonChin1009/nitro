"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trophy, Star } from "lucide-react"

interface RewardModalProps {
  name: string
  description: string
  reputationScore: number
  contributionPoints: number
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onAccept?: () => void
}

export function BorrowerRewardModal({
  name,
  description,
  reputationScore,
  contributionPoints,
  isOpen,
  onOpenChange,
  onAccept,
}: RewardModalProps) {
 
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Trophy className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold mt-4">{name}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3">
            <Star className="h-5 w-5 text-amber-500 mb-1" />
            <p className="text-sm text-gray-500">Reputation Score</p>
            <p className="text-lg font-medium">+{reputationScore}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3">
            <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-100">Points</Badge>
            <p className="text-sm text-gray-500">Contribution Points</p>
            <p className="text-lg font-medium">+{contributionPoints}</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onAccept} className="w-full sm:w-auto">
            Accept Reward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

