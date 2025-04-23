"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LenderRewardModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  points: number
  experienceGained: number
}

export function LenderRewardModal({
  isOpen,
  onClose,
  title = "Thank You for Your Contribution!",
  description = "Your contribution to the DAO has been accepted.",
  points,
  experienceGained,
}: LenderRewardModalProps) {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-0 overflow-hidden">
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-900">{title}</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">{description}</DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="text-gray-700">Contribution Points</div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm font-medium">
                +{points} points
              </Badge>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="text-gray-700">Experience Gained</div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm font-medium">
                +{experienceGained} XP
              </Badge>
            </div>              
          </div>

          <div className="mt-8">
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
