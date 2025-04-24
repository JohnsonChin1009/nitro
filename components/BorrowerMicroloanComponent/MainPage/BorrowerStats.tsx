"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function BorrowerStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Average Financial Health Score</p>
            <Progress value={78} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">RM21,300</div>
            <p className="text-xs text-muted-foreground">Average Loan Amount</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Repayment Rate</p>
            <Progress value={92} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">8.5 mo</div>
            <p className="text-xs text-muted-foreground">Average Repayment Period</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
