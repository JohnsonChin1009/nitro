"use client";
import { ArrowDown, ArrowUp, Info, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CommunityTab = () => {
  const groups = [
    {
      id: 1,
      name: "Neighborhood Savers",
      members: 6,
      totalPool: "RM 15,000",
      repaymentRate: 100,
      rank: 1,
    },
    {
      id: 2,
      name: "Your Group",
      members: 5,
      totalPool: "RM 12,500",
      repaymentRate: 95,
      rank: 2,
      isYourGroup: true,
    },
    {
      id: 3,
      name: "Family Circle",
      members: 4,
      totalPool: "RM 10,000",
      repaymentRate: 92,
      rank: 3,
    },
    {
      id: 4,
      name: "Business Partners",
      members: 8,
      totalPool: "RM 20,000",
      repaymentRate: 90,
      rank: 4,
    },
    {
      id: 5,
      name: "Community Heroes",
      members: 10,
      totalPool: "RM 25,000",
      repaymentRate: 88,
      rank: 5,
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Rankings</CardTitle>
          <CardDescription>
            See how your group compares to others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Total Pool</TableHead>
                <TableHead>Repayment Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow
                  key={group.id}
                  className={group.isYourGroup ? "bg-muted" : ""}
                >
                  <TableCell>
                    <div className="flex items-center">
                      {group.rank === 1 && (
                        <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                      )}
                      {group.rank}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.name}
                    {group.isYourGroup && (
                      <Badge className="ml-2">Your Group</Badge>
                    )}
                  </TableCell>
                  <TableCell>{group.members}</TableCell>
                  <TableCell>{group.totalPool}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={group.repaymentRate}
                        className="h-2 w-24"
                      />
                      <span>{group.repaymentRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <ArrowUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">Top Performing Group</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Neighborhood Savers with 100% repayment rate
            </p>
          </div>

          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Average Pool Size</span>
            </div>
            <p className="text-sm text-muted-foreground">
              RM 16,500 across all groups
            </p>
          </div>

          <div className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <ArrowDown className="h-4 w-4 text-red-600" />
              <span className="font-medium">Lowest Repayment Rate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Education First with 75% repayment rate
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Community Groups
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunityTab;
