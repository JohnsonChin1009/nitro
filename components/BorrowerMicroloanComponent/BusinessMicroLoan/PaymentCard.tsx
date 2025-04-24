import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { CalendarIcon, CircleDollarSign } from "lucide-react"
import { cn } from '@/lib/utils'
const PaymentCard = ({currentPhase, currentPhaseData, paymentMade, handleMakePayment}: any) => {
  return (
    <Card className="h-full flex flex-col">
    <CardHeader className="bg-muted/50">
      <CardTitle className="flex items-center gap-2">
        <CircleDollarSign className="h-5 w-5" />
        Make a Payment
      </CardTitle>
      <CardDescription>Complete your Phase {currentPhase} payment to proceed to the next phase</CardDescription>
    </CardHeader>
    <CardContent className="pt-6 flex-grow">
      <div className="grid gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">Current Phase</p>
          <p className="text-lg font-semibold">
            Phase {currentPhase}: {currentPhaseData.name}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Amount Due</p>
          <p className="text-lg font-semibold">RM {currentPhaseData.amount.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Due Date</p>
          <p className="text-lg font-semibold flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {currentPhaseData.dueDate}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Status</p>
          <p className={cn("text-lg font-semibold", paymentMade ? "text-green-600" : "text-amber-600")}>
            {paymentMade ? "Paid" : "Pending Payment"}
          </p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="mt-auto">
      <Button className="w-full" onClick={handleMakePayment} disabled={paymentMade}>
        {paymentMade ? "Payment Complete" : "Make Payment"}
      </Button>
    </CardFooter>
  </Card>
  )
}

export default PaymentCard
