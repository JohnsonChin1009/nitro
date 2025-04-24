"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RewardCardProps {
  image: string
  title: string
  description: string
  pointsNeeded: number
  onRedeem?: () => void
  className?: string
}

export function ShopItemCard({ image, title, description, pointsNeeded, onRedeem, className }: RewardCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl transition-all duration-300", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 opacity-0 blur-xl transition-opacity duration-500",
          isHovered ? "opacity-70" : "opacity-0",
        )}
      />

      {/* Card content */}
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-0.5 shadow-md transition-all duration-300 hover:shadow-xl">
        {/* Glow border */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 flex h-full flex-col rounded-[10px] bg-card p-5">
          {/* Image */}
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="mb-4 flex-1 text-sm text-muted-foreground">{description}</p>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Points needed:</span>
                <span className="font-bold text-purple-500">{pointsNeeded}</span>
              </div>

              <Button
                onClick={onRedeem}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                Redeem Reward
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
