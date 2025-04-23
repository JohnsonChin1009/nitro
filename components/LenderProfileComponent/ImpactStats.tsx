"use client";
import React from 'react'
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const ImpactStats = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <Card>
      <CardHeader>
        <CardTitle>Impact Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Agriculture</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farmers Supported</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hectares Cultivated</span>
                  <span className="font-medium">18.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sustainable Practices</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Education</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students Supported</span>
                  <span className="font-medium">16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schools Improved</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Graduation Rate</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Small Business</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Businesses Funded</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jobs Created</span>
                  <span className="font-medium">38</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span className="font-medium">32%</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Healthcare</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clinics Supported</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patients Served</span>
                  <span className="font-medium">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medical Staff Hired</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View Detailed Impact Report
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
  )
}

export default ImpactStats