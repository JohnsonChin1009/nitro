"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
  index?: number;
}

const FeatureCard = ({
  icon,
  title,
  className,
  index = 0,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "max-w-[300px] group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <motion.div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {icon}
        </motion.div>

        <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>

        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Button
            variant="ghost"
            className="group/button p-0 hover:bg-transparent"
          >
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
