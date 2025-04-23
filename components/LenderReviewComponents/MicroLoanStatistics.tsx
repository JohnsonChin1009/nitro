"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, TrendingDown, DollarSign, AlertCircle, Users } from "lucide-react"
import { useEffect, useState } from "react"

// Animated counter component
const AnimatedCounter = ({ value, duration = 1500 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        setCount(Math.floor((progress / duration) * value))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function LoanStatisticsCard() {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalApproved: 1248,
    approvedToday: 37,
    approvedYesterday: 29,
    totalValue: 28500,
    avgLoanSize: 3433,
    defaultRate: 3.2,
    defaultCount: 42,
    highRiskCount: 156,
    activeMembers: 78,
    votesLastWeek: 1243,
  }

  // Calculate percentage change
  const approvalChange = Math.round(((stats.approvedToday - stats.approvedYesterday) / stats.approvedYesterday) * 100)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Microloan Statistics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Active Loans</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter value={stats.totalApproved} />
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={stats.approvedToday} />
                </p>
                <span
                  className={`text-xs flex items-center ${approvalChange >= 0 ? "text-emerald-500" : "text-red-500"}`}
                >
                  {approvalChange >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(approvalChange)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                $<AnimatedCounter value={stats.totalValue} />
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Avg. Loan Size</p>
              <p className="text-2xl font-bold">
                $<AnimatedCounter value={stats.avgLoanSize} />
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Risk metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Default Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">{stats.defaultRate}%</p>
                  <span className="text-xs text-muted-foreground">
                    (<AnimatedCounter value={stats.defaultCount} /> loans)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Loans</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">
                    <AnimatedCounter value={stats.highRiskCount} />
                  </p>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((stats.highRiskCount / stats.totalApproved) * 100)}% of total)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">DAO Member Activity</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">
                    <AnimatedCounter value={stats.activeMembers} />
                  </p>
                  <span className="text-xs text-muted-foreground">active members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Additional metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Votes Last Week</p>
              <p className="text-xl font-bold">
                <AnimatedCounter value={stats.votesLastWeek} />
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Votes Per Loan</p>
              <p className="text-xl font-bold">
                {Math.round((stats.votesLastWeek / stats.approvedToday) * 7 * 10) / 10}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
              <p className="text-xl font-bold">76%</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Repayment Time</p>
              <p className="text-xl font-bold">4.2 months</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
