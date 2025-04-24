import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const OverallBusinessMicroLoanCard = ({currentPhase, currentPhaseData, phaseData, paymentMade}: any) => {
  return (
      <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Business & Loan Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Details Section */}
        <div>
          <h3 className="font-medium mb-3">Business Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Business Name</h4>
              <p className="font-medium">May Textile Sdn Bhd</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Business Type</h4>
              <p className="font-medium">Artisan Business</p>
            </div>
          </div>
        </div>

        {/* Loan Summary Section */}
        <div>
          <h3 className="font-medium mb-3">Loan Summary</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Loan Amount</h4>
              <p className="font-bold text-2xl">RM 15,000</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Remaining Balance</h4>
              <p className="font-bold text-2xl">
                RM{" "}
                {(
                  15000 -
                  (currentPhase > 1 ? phaseData[1].amount : 0) -
                  (currentPhase > 2 ? phaseData[2].amount : 0) -
                  (paymentMade && currentPhase === 3 ? phaseData[3].amount : 0)
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Next Payment Due</h4>
              <p className="font-bold text-2xl">
                {paymentMade && currentPhase === 3 ? (
                  <span className="text-green-600">Fully Paid</span>
                ) : (
                  <>RM {currentPhaseData.amount.toLocaleString()}</>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentMade && currentPhase === 3 ? (
                  "No more payments"
                ) : (
                  <>Due: {currentPhaseData.dueDate}</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Phased Approach Section - Simplified */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Phased Approach</h3>
          <p className="text-muted-foreground">
            Your RM15,000 microloan is structured into three strategic phases aligned with the natural growth
            stages of typical startups based on historical data. This approach ensures funds are allocated to the most critical
            needs at each development stage.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default OverallBusinessMicroLoanCard
