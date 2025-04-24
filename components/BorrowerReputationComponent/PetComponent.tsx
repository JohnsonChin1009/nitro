
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  Heart, Shield } from "lucide-react"

export default function PetComponent({petState, setPetState, image}: any) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Financial Pet</span>
          <Badge variant="outline" className="ml-2 text-lg font-bold">
            Level {petState.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pet Image */}
        <div className="relative flex justify-center">
          <div className="relative w-48 h-48 bg-gradient-to-b from-amber-50 to-amber-100 rounded-full flex items-center justify-center">
            <img
              src={image}
              alt="Financial Pet Cat"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>

        {/* Reputation Score */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500">Reputation Score</h3>
          <div className="text-4xl font-bold">{petState.reputationScore}</div>

        </div>

        {/* Level Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Level Progress</span>
            <span>{petState.levelProgress}%</span>
          </div>
          <Progress value={petState.levelProgress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Level {petState.level}</span>
            <span>Level {petState.level + 1}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="font-medium">Pet Stats</h3>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-500" /> Happiness
              </span>
              <span>{petState.happiness}%</span>
            </div>
            <Progress value={petState.happiness} className="h-2 bg-gray-200" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-blue-500" /> Strength
              </span>
              <span>{petState.strength}%</span>
            </div>
            <Progress value={petState.strength} className="h-2 bg-gray-200" />
          </div>
        </div>

        {/* Bonuses */}
        <div>
          <h3 className="font-medium mb-2">Active Bonuses</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">+5% Loan Rate</Badge>
            <Badge variant="secondary">+$200 Credit Limit</Badge>
            <Badge variant="secondary">Fast Approval</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
