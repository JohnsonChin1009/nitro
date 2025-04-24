"use client";
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, DollarSign, Calendar,  ArrowDown } from "lucide-react"

const SimulatorTab = ({paymentAmount, handlePaymentChange, handleInputChange,newTerm, monthsSaved, interestSaved, percentSaved, payoffDate}:any) => {
  return (
    <TabsContent value="simulator">
    <Card>
      <CardHeader>
        <CardTitle>Payment Simulator</CardTitle>
        <CardDescription>See how changing your payment amount affects your bicycle loan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-amount">Monthly Payment Amount</Label>
            <div className="flex items-center gap-4 mt-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="payment-amount"
                value={[paymentAmount]}
                max={500}
                min={100}
                step={10}
                className="flex-1"
                onValueChange={handlePaymentChange}
              />
              <div className="w-20">
                <Input
                  type="number"
                  value={paymentAmount.toFixed(2)}
                  onChange={handleInputChange}
                  className="text-right"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">New Loan Term</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Months</span>
                  </div>
                  <span className="text-2xl font-bold">{newTerm}</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                  {monthsSaved} months saved
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Interest Saved</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">${interestSaved.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                  {percentSaved}% reduction
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Payoff Date</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xl font-bold">{payoffDate}</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                  Earlier than planned
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
  )
}

export default SimulatorTab
