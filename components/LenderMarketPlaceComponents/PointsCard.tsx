"use client";
 
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { MagicCard } from "../magicui/magic-card";
import { Award } from "lucide-react";

 
export function PointsCard({userPoints}: any) {

  return (
    <Card className="p-0 max-w-[350px]  shadow-none border-none">
      <MagicCard
        gradientColor={ "#D9D9D955"}
        className="p-0  bg-primary/10"
      >
        <CardContent className="p-2">
        <div className="mt-4 sm:mt-0 rounded-lg py-1 px-10 flex items-center">
            <Award className="h-6 w-6 text-primary mr-2"/>
            <div>
              <p className="text-sm font-medium">Earned Contribution Points</p>
              <p className="text-2xl font-bold">{userPoints}</p>
            </div>
          
          </div>
        </CardContent>
      </MagicCard>
    </Card>
  );
}