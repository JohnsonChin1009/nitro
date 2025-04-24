"use client"

import { Award } from "lucide-react"
import { CardSpotlight } from "../aceternityui/card-spotlight";


export function ContributionPointCard({userPoints}: any) {
  return (
    <CardSpotlight className="h-22 w-96">
    
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
            <Award className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500">Contribution Points</div>
            <div className="text-2xl font-bold">{String(userPoints)}</div>
          </div>
        </div>
        <div className="flex items-center justify-center px-3 py-1 bg-green-50 rounded-full">
          <div className="text-sm font-medium text-green-600">+12%</div>
        </div>
      </div>
    
    </CardSpotlight>
  );
}
