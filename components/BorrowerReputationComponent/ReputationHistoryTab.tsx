import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"

export default function ReputationHistoryTab() {
  const historyItems = [
    {
      id: 1,
      type: "repayment",
      description: "Loan repayment on time",
      amount: "+25",
      date: "Today",
      time: "10:30 AM",
      positive: true,
    },
    {
      id: 2,
      type: "loan",
      description: "New loan approved",
      amount: "$500",
      date: "Today",
      time: "9:15 AM",
      positive: true,
    },
    {
      id: 3,
      type: "repayment",
      description: "Early loan repayment bonus",
      amount: "+15",
      date: "Yesterday",
      time: "3:45 PM",
      positive: true,
    },
    {
      id: 4,
      type: "late",
      description: "Late payment fee",
      amount: "-10",
      date: "3 days ago",
      time: "11:20 AM",
      positive: false,
    },
    {
      id: 5,
      type: "repayment",
      description: "Loan repayment on time",
      amount: "+20",
      date: "1 week ago",
      time: "2:00 PM",
      positive: true,
    },
    {
      id: 6,
      type: "loan",
      description: "New loan approved",
      amount: "$300",
      date: "2 weeks ago",
      time: "10:00 AM",
      positive: true,
    },
    {
      id: 7,
      type: "repayment",
      description: "Loan repayment on time",
      amount: "+20",
      date: "3 weeks ago",
      time: "4:30 PM",
      positive: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Activity History</CardTitle>
        <CardDescription>Track your loan activities and reputation points</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div key={item.id} className="flex items-start p-3 border rounded-lg">
                <div className={`rounded-full p-2 mr-3 ${item.positive ? "bg-green-100" : "bg-red-100"}`}>
                  {item.type === "repayment" ? (
                    <ArrowUp className={`h-5 w-5 ${item.positive ? "text-green-600" : "text-red-600"}`} />
                  ) : item.type === "loan" ? (
                    <ArrowDown className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.description}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{item.date}</span>
                        <span className="mx-1">•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.type === "repayment" || item.type === "late" ? (
                        <Badge className="font-bold">
                          {item.amount} points
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-bold">
                          {item.amount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
