import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { approvedmicroloans } from "@/mockData/mockData"
import Link from "next/link"

type RiskLevel = "Low" | "Medium" | "High"
export function BorrowerMicroloanCard() {
  
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return "text-green-600"
      case "Medium":
        return "text-amber-600"
      case "High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }


  return (
    <Card className="w-full  bg-white shadow-md">
      <CardHeader className="border-b pb-2 pt-3">
        <CardTitle className="text-2xl font-bold">Approved Microloans</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <div className="space-y-2">
          {approvedmicroloans.map((loan) => (
            <div key={loan.id} className="py-3 px-6 border rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-xl mb-1">{loan.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      ID: {loan.id}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="font-normal py-1 px-3">
                      {loan.type} Microloan
                    </Badge>
                  </div>

                  <div className="w-full max-w-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Risk Score</span>
                      <span className={`text-sm font-medium ${getRiskColor(loan.riskScore.level)}`}>
                        {loan.riskScore.level} ({loan.riskScore.value}/100)
                      </span>
                    </div>
                   
                    <Progress
                      value={loan.riskScore.value}
                      className="h-2 max-w-[400px]"
                     
                    />
                  
                  
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col justify-between gap-6">
                  <div className="flex flex-col md:flex-row lg:flex-col gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                      <p className="font-medium text-lg">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Amount</p>
                      <p className="font-medium text-lg">
                        {loan.currency} {loan.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/microloan/${loan.id}`}>
                  <Button className="whitespace-nowrap self-start lg:self-end">
                    Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
