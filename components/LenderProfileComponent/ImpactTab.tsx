"use client";
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import MicroloanImpactCarousel from './CarouselImpact';
import ImpactStats from './ImpactStats';
const ImpactTab = () => {
  return (
    <TabsContent value="impact" className="space-y-4 mt-4">
        <div className='flex flex-col space-y-5'>
        <Card>
              <CardHeader>
                <CardTitle>The Impact You've Created</CardTitle>
                <CardDescription> Each microloan you've supported helps an individual rise, a family grow, and a community thrive.</CardDescription>
              </CardHeader>
              <CardContent>
                <MicroloanImpactCarousel/>
              </CardContent>
            </Card>
            </div>
        <ImpactStats/>
    </TabsContent>
  )
}

export default ImpactTab
