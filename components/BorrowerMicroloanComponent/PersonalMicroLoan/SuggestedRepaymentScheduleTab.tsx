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
import { CalendarDays } from "lucide-react"

const SuggestedRepaymentScheduleTab = () => {
  return (
    <TabsContent value="schedule">
      <Card>
        <CardHeader>
          <CardTitle>Suggested Repayment Schedule</CardTitle>
          <CardDescription>
            Monthly breakdown of your bicycle loan payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
              <div>Date</div>
              <div>Payment</div>
              <div>Principal</div>
              <div>Remaining</div>
            </div>
            <div className="divide-y">
              {[
                {
                  date: "May 15, 2025",
                  payment: "$227.53",
                  principal: "$192.28",
                  remaining: "$3,058.17",
                },
                {
                  date: "Jun 15, 2025",
                  payment: "$227.53",
                  principal: "$193.65",
                  remaining: "$2,864.52",
                },
                {
                  date: "Jul 15, 2025",
                  payment: "$227.53",
                  principal: "$195.03",
                  remaining: "$2,669.49",
                },
                {
                  date: "Aug 15, 2025",
                  payment: "$227.53",
                  principal: "$196.42",
                  remaining: "$2,473.07",
                },
                {
                  date: "Sep 15, 2025",
                  payment: "$227.53",
                  principal: "$197.82",
                  remaining: "$2,275.25",
                },
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-4 p-3 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.date}
                  </div>
                  <div>{item.payment}</div>
                  <div>{item.principal}</div>
                  <div>{item.remaining}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing the next 5 payments. Full schedule available for download.
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SuggestedRepaymentScheduleTab;
