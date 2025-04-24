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
import { TrendingUp, Calendar } from "lucide-react";

const SuggestRepaymentStrategyTab = () => {
  return (
    <TabsContent value="strategy">
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Repayment Strategy</CardTitle>
          <CardDescription>
            Personalized recommendations to help you pay off your bicycle loan
            faster
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Accelerated Repayment Plan
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your income and expenses, we recommend increasing your
              monthly payment by $50. This will:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Reduce your loan term by 4 months</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Save $187.45 in interest payments</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Get you riding your new bicycle debt-free sooner</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Bi-weekly Payment Option
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Consider switching to bi-weekly payments of $113.77 instead of
              monthly payments. This will:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Make an extra payment each year</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Reduce your loan term by 3 months</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2 text-xs">
                  ✓
                </span>
                <span>Save $142.30 in interest payments</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SuggestRepaymentStrategyTab;
