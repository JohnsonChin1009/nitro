"use client";
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const MicroLoanPoolCard = ({pool, handleAddFund, key}:any) => {
  return (
    <Card key={pool.id} className="overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-md ${pool.color}`}>
          <pool.icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <CardTitle className="text-lg mt-2">{pool.title}</CardTitle>
      <CardDescription>{pool.description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{Math.round((pool.current / pool.target) * 100)}%</span>
        </div>
        <Progress value={(pool.current / pool.target) * 100} className="h-2" />
        <div className="flex justify-between text-sm pt-1">
          <span className="text-muted-foreground">RM {pool.current.toLocaleString()}</span>
          <span className="text-muted-foreground">RM {pool.target.toLocaleString()}</span>
        </div>

        {/* Microloan Information */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span>Active Microloans:</span>
            <span className="font-medium">{pool.activeLoans}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Avg. Loan Size:</span>
            <span className="font-medium">RM {pool.avgLoanSize.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={() => handleAddFund(pool.id)}>
        <Plus className="mr-2 h-4 w-4" /> Add Fund
      </Button>
    </CardFooter>
  </Card>
  )
}

export default MicroLoanPoolCard
