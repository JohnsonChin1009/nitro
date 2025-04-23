"use client";
import React from 'react'
import { mockUserData } from '@/mockData/mockData';
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Wallet, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


const ProfileHeader = () => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((mockUserData.xp / mockUserData.xpToNextLevel) * 100)
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
     {/* Profile Header */}
     <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
     className="mb-3 min-w-[1200px]"
   >
     <Card className="border-2 border-primary/20 bg-background/60 backdrop-blur-sm">
       <CardContent className="px-6 py-2">
         <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
           <motion.div whileHover={{ scale: 1.05 }} className="relative">
             <Avatar className="h-24 w-24 border-4 border-primary">
               <AvatarImage src={mockUserData.profileImage} alt={mockUserData.name} />
               <AvatarFallback>AD</AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm border-2 border-background">
               {mockUserData.level}
             </div>
           </motion.div>

           <div className="flex-1 text-center md:text-left">
             <div className="flex flex-col md:flex-row md:items-center gap-2">
               <h1 className="text-2xl font-bold">{mockUserData.name}</h1>
               <Badge variant="outline" className="md:ml-2 self-center">
                 {mockUserData.handle}
               </Badge>
             </div>
             <p className="text-muted-foreground mt-1">Member since {mockUserData.joinDate}</p>
            <div className='mt-2'>
                <p>Total Points Earned: <span>1200 reward points</span></p>
            </div>
             <div className="mt-4 max-w-md">
               <div className="flex justify-between mb-1">
                 <div className="flex items-center">
                   <Award className="h-4 w-4 mr-1 text-primary" />
                   <span className="text-sm font-medium">Level {mockUserData.level}</span>
                 </div>
                 <span className="text-sm text-muted-foreground">
                   {mockUserData.xp} / {mockUserData.xpToNextLevel} XP
                 </span>
               </div>
               <div className="relative">
                 <Progress value={progress} className="h-3" />
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.8, duration: 0.5 }}
                   className="absolute -right-1 -top-1"
                 >
                   <Sparkles className="h-5 w-5 text-yellow-500" />
                 </motion.div>
               </div>
               <p className="text-xs text-muted-foreground mt-1">
                 {mockUserData.xpToNextLevel - mockUserData.xp} XP needed for Level {mockUserData.level + 1}
               </p>
             </div>
           </div>

           <div className="flex flex-col items-center md:items-end gap-2">
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Card className="bg-primary text-primary-foreground border-none">
                 <CardContent className="p-4 flex flex-col items-center">
                   <p className="text-xs uppercase font-semibold opacity-80">Total Pooled</p>
                   <p className="text-2xl font-bold">${mockUserData.totalPooled.toLocaleString()}</p>
                 </CardContent>
               </Card>
             </motion.div>
             <Button variant="outline" size="sm" className="gap-1">
               <Wallet className="h-4 w-4 mr-1" />
               Add Funds
             </Button>
           </div>
         </div>
       </CardContent>
     </Card>
   </motion.div>
   </>
  )
}

export default ProfileHeader