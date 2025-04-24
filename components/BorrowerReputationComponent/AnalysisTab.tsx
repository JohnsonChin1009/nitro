import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, TrendingUp, Award } from "lucide-react"

export default function AnalysisTab() {
  const chatMessages = [
    {
      id: 1,
      message:
        "Meow! Your financial reputation is looking purrfect! You've been consistently paying back your loans on time.",
      time: "Just now",
      isSystem: false,
    },
    {
      id: 2,
      message: "I'm so happy you paid back your last loan early! That earned you bonus reputation points!",
      time: "5 minutes ago",
      isSystem: false,
    },
    {
      id: 3,
      message: "Analysis: Your current reputation score is 30% higher than the average user at your level.",
      time: "10 minutes ago",
      isSystem: true,
    },
    {
      id: 4,
      message: "If you continue this pattern, you'll reach Level 4 in approximately 2 weeks!",
      time: "15 minutes ago",
      isSystem: true,
    },
    {
      id: 5,
      message: "Meow! I'm feeling extra happy today because your financial habits are so responsible!",
      time: "1 hour ago",
      isSystem: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reputation Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your reputation score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Base Reputation</p>
              <p className="text-2xl font-bold">80</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Reputation</p>
              <p className="text-2xl font-bold">650</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Score Breakdown
            </h3>

            <ul className="space-y-2">
              <li className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span>On-time Payments</span>
                <Badge variant="outline" className="font-bold">
                  +350
                </Badge>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span>Early Repayments</span>
                <Badge variant="outline" className="font-bold">
                  +120
                </Badge>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span>Consistent History</span>
                <Badge variant="outline" className="font-bold">
                  +80
                </Badge>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span>Loan Utilization</span>
                <Badge variant="outline" className="font-bold">
                  +40
                </Badge>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <span>Late Payments</span>
                <Badge variant="destructive" className="font-bold">
                  -20
                </Badge>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Pet Analysis Chat
            </CardTitle>
            <Badge variant="outline" className="font-normal">
              <Award className="h-4 w-4 mr-1" /> Financial Advisor Cat
            </Badge>
          </div>
          <CardDescription>Your pet's analysis of your financial behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.isSystem ? "bg-gray-100 border border-gray-200" : "bg-amber-50 border border-amber-100"
                  }`}
                >
                  <p className={message.isSystem ? "text-gray-700" : "text-amber-800"}>{message.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
