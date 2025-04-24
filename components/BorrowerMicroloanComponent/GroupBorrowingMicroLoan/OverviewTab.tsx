"use client";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Percent,
  Upload,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OverviewTab = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Loan Overview</CardTitle>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Total Pool</span>
              <span className="text-2xl font-bold">RM 12,500</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Members</span>
              <span className="text-2xl font-bold">5</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">
                Repayment Progress
              </span>
              <div className="flex items-center space-x-2">
                <Progress value={35} className="h-2" />
                <span className="text-sm font-medium">35%</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">
                Next Payment
              </span>
              <span className="text-lg font-medium">15 May 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                Loan Amount per Member
              </p>
              <p className="font-medium">RM 2,500</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Percent className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="font-medium">3.5% p.a.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Repayment</p>
              <p className="font-medium">RM 215</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Term Length</p>
              <p className="font-medium">12 months</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              The entire group is responsible for repayments. If one member
              doesn't pay, others must cover the repayment.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            The individual or group will be disqualified from future borrowing
            until the issue is resolved and credit score will be reduced.
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your loan and payments</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Retrieve Microloan from Pool
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Make Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
