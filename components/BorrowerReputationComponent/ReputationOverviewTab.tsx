import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, AlertCircle } from "lucide-react"

export default function ReputationOverviewTab() {
  const perks = [
    { level: 1, name: "Basic Loan Access", active: true },
    { level: 2, name: "+$100 Credit Limit", active: true },
    { level: 3, name: "5% Lower Interest Rate", active: true },
    { level: 4, name: "Priority Support", active: false },
    { level: 5, name: "Instant Approval", active: false },
    { level: 7, name: "Premium Rewards", active: false },
    { level: 10, name: "VIP Financial Status", active: false },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Profile</CardTitle>
          <CardDescription>Your current financial standing and loan eligibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Current Loan Eligibility</h3>
              <p className="text-sm text-gray-500">Based on your reputation score</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">$1,200</span>
              <p className="text-sm text-green-600">Approved</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Credit Utilization</span>
              <span>35%</span>
            </div>
            <Progress value={35} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="font-bold">12.5%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Payment History</p>
              <p className="font-bold text-green-600">Excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perks by Level</CardTitle>
          <CardDescription>Unlock more benefits as your pet levels up</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {perks.map((perk, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  {perk.active ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-300 mr-2" />
                  )}
                  <span className={perk.active ? "font-medium" : "text-gray-500"}>{perk.name}</span>
                </div>
                <Badge variant={perk.active ? "default" : "outline"}>Level {perk.level}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
