"use client";
import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopItemCard } from "./ShopItemCard";
import { TabsContent } from "@/components/ui/tabs";
import { swagitems } from "@/mockData/mockData";
import { PurchaseModal } from "./PurchaseModal";

const SwagTab = ({ contributionPoint, setUserContributionPoint }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const handlePurchase = (points: any) => {
    setUserContributionPoint(contributionPoint - points);
  };

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  // Card variants for the deck animation
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      x: -100,
      rotateY: 90,
      rotateX: 45,
      scale: 0.5,
      skewX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      skewX: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 10,
        mass: 1.2,
        velocity: 2,
      },
    },
  };
  return (
    <TabsContent value="swag" className="space-y-4 mt-4">
      <motion.div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {swagitems.map((swagitem) => (
          <div key={swagitem.id} style={{ perspective: "1200px" }}>
            <motion.div variants={cardVariants}>
              <ShopItemCard
                image={swagitem.image}
                title={swagitem.title}
                description={swagitem.description}
                pointsNeeded={swagitem.pointsNeeded}
                onRedeem={() => handleSelect(swagitem)}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
      {selectedProduct && (
        <PurchaseModal
          productName={selectedProduct.name}
          pointsNeeded={selectedProduct.pointsNeeded}
          userPoints={contributionPoint}
          onPurchase={() => handlePurchase(selectedProduct.pointsNeeded)}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </TabsContent>
  );
};

export default SwagTab;
