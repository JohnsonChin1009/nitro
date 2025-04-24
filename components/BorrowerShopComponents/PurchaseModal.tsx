"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"



export function PurchaseModal({
  productName,
  pointsNeeded,
  userPoints,
  onPurchase,
  open,
  onOpenChange,
}: any) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const hasEnoughPoints = userPoints >= pointsNeeded
  const pointsRemaining = userPoints - pointsNeeded

  const handlePurchase = () => {
    if (!hasEnoughPoints) return

    setIsPurchasing(true)

    // Simulate API call
    setTimeout(() => {
      onPurchase()
      setIsPurchasing(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase {productName}</DialogTitle>
          <DialogDescription>Confirm your purchase using your contribution points.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Product:</span>
            <span>{productName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Points Required:</span>
            <Badge variant="outline" className="font-semibold">
              {pointsNeeded} points
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Your Points:</span>
            <Badge variant={hasEnoughPoints ? "default" : "destructive"} className="font-semibold">
              {userPoints} points
            </Badge>
          </div>

          {hasEnoughPoints ? (
            <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
              <Check className="h-4 w-4" />
              <span>You have enough points! {pointsRemaining} points will remain after purchase.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
              <X className="h-4 w-4" />
              <span>You need {pointsNeeded - userPoints} more points to purchase this item.</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={!hasEnoughPoints || isPurchasing}>
            {isPurchasing ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
