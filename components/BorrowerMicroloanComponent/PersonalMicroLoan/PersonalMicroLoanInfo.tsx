import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, ArrowDown, Bike } from "lucide-react";

const PersonalMicroLoanInfo = ({ data }: any) => {
  return (
    <Card className="mb-8 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-2/3">
          <CardHeader className="py-3">
            <CardTitle>Personal MicroLoan Overview</CardTitle>
            <CardDescription>
              Finance your dream bicycle with affordable monthly payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loan Purpose</span>
                  <span className="font-semibold flex items-center">
                    <Bike className="h-4 w-4 mr-1" /> {data.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-semibold">$5,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-semibold">8.5% APR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Term Length</span>
                  <span className="font-semibold">24 months</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Remaining Balance
                  </span>
                  <span className="font-semibold">$3,250.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid So Far</span>
                  <span className="font-semibold">$1,749.55</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Next Payment Due
                  </span>
                  <span className="font-semibold">May 15, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Payment</span>
                  <span className="font-semibold">$227.53</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loan Progress</span>
                <span>35% Paid</span>
              </div>
              <Progress value={35} className="h-3" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 py-4">
            <Button className="w-full sm:w-auto" variant="default">
              <Wallet className="mr-2 h-4 w-4" />
              Pay Back Microloan
            </Button>
            <Button className="w-full sm:w-auto" variant="outline">
              <ArrowDown className="mr-2 h-4 w-4" />
              Withdraw Microloan
            </Button>
          </CardFooter>
        </div>
        <div className="md:w-1/3 bg-muted">
          <div className="h-full flex items-center justify-center p-4">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="Mountain bike"
              className="rounded-lg object-cover max-h-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalMicroLoanInfo;
