"use client";
import React from 'react'
import { mockUserData } from '@/mockData/mockData';
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingOpportunities from './UpcomingPools';

const PoolsTab = () => {
  return (
     <TabsContent value="pools" className="space-y-4 mt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Microloan Pools</CardTitle>
                  <CardDescription>Overview of your current investments across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserData.pools.map((pool, index) => (
                      <motion.div
                        key={pool.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full ${pool.color} mr-2`}></div>
                            <span className="font-medium">{pool.name}</span>
                          </div>
                          <span className="text-sm font-medium">${pool.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <Progress
                              value={(pool.amount / mockUserData.totalPooled) * 100}
                              className={`h-2 ${pool.color}`}
                            />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {pool.apy}% APY
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
    
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average APY</span>
                      <span className="font-medium">
                        {(
                          mockUserData.pools.reduce((acc, pool) => acc + pool.apy, 0) / mockUserData.pools.length
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Level {mockUserData.level} Bonus</span>
                      <Badge variant="secondary" className="text-xs">
                        +0.5%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <div className='mt-5'>
                <UpcomingOpportunities/>
            </div>
          </TabsContent>
  )
}

export default PoolsTab