"use client"

import { JSX, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle2, Circle, Lock, Trophy, Zap, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AchievementCard() {
    const achievements = [
        { id: 1, name: "Early Adopter", description: "Joined during platform beta", completed: true },
        { id: 2, name: "Diversified", description: "Invested in 3+ categories", completed: true },
        { id: 3, name: "Whale Status", description: "Pool over 10,000 tokens", completed: true },
        { id: 4, name: "Community Leader", description: "Refer 10+ active lenders", completed: false },
        { id: 5, name: "Power User", description: "Log in for 30 consecutive days", completed: false },
        { id: 6, name: "Market Maker", description: "Create a successful lending pool", completed: true },
        { id: 7, name: "Risk Taker", description: "Invest in a high-risk category", completed: false },
        { id: 8, name: "First Million", description: "Earn 1,000,000 tokens in interest", completed: false },
    ]
  const [showAll, setShowAll] = useState(false)
  const displayCount = showAll ? achievements.length : 4
  const displayedAchievements = achievements.slice(0, displayCount)
  const hasMore = achievements.length > 4

  // Get achievement icon based on name
  const getAchievementIcon = (name: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "Early Adopter": <Zap className="h-5 w-5" />,
      Diversified: <Badge className="h-5 w-5" />,
      "Whale Status": <Trophy className="h-5 w-5" />,
      "Community Leader": <Lock className="h-5 w-5" />,
      "Power User": <Zap className="h-5 w-5" />,
      "Market Maker": <Trophy className="h-5 w-5" />,
      "Risk Taker": <Badge className="h-5 w-5" />,
      "First Million": <Trophy className="h-5 w-5" />,
    }

    return iconMap[name] || <Badge className="h-5 w-5" />
  }

  return (
    <Card className="w-full max-w-md border border-gray-200 bg-white shadow-md">
      <CardContent>
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 py-5">Achievements Badges</h1>
            <Button className="bg-white text-green-600">Show More</Button>
        </div>
        
        <ul className="space-y-3">
          {displayedAchievements.map((achievement) => (
            <li
              key={achievement.id}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg border p-3 transition-all duration-300",
                achievement.completed
                  ? "border-green-100 bg-green-50 hover:bg-green-100"
                  : "border-gray-100 bg-gray-50 hover:bg-gray-100",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  achievement.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400",
                )}
              >
                {getAchievementIcon(achievement.name)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn("font-semibold", achievement.completed ? "text-gray-800" : "text-gray-500")}>
                    {achievement.name}
                  </h3>
                  {achievement.completed && (
                    <span className="inline-flex">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </span>
                  )}
                </div>
                <p className={cn("text-sm", achievement.completed ? "text-gray-600" : "text-gray-400")}>
                  {achievement.description}
                </p>
              </div>

              <div
                className={cn(
                  "absolute -right-1 -top-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                  achievement.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                )}
              >
                {achievement.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </div>

              {achievement.completed && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      
    </Card>
  )
}
