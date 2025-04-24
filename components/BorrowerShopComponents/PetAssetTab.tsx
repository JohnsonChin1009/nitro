"use client";
import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopItemCard } from "./ShopItemCard";
import { TabsContent } from "@/components/ui/tabs";
import { assetitems } from "@/mockData/mockData";
import { PurchaseModal } from "./PurchaseModal";



const PetAssetTab = ({ contributionPoint, setUserContributionPoint }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const handlePurchase = (points: any) => {
    setUserContributionPoint( contributionPoint - points);
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
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Card variants for the deck animation
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateY: 45,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };
  return (
    <TabsContent value="asset" className="space-y-4 mt-4">
      <motion.div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {assetitems.map((assetitem) => (
          <motion.div key={assetitem.id} variants={cardVariants}>
            <ShopItemCard
              image={assetitem.image}
              title={assetitem.title}
              description={assetitem.description}
              pointsNeeded={assetitem.pointsNeeded}
              onRedeem={() => handleSelect(assetitem)}
            />
          </motion.div>
        ))}
      </motion.div>
      {selectedProduct && (
        <PurchaseModal
          productName={selectedProduct.name}
          pointsNeeded={selectedProduct.pointsNeeded}
          userPoints={contributionPoint}
          onPurchase={()=> handlePurchase(selectedProduct.pointsNeeded)}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </TabsContent>
  );
};

export default PetAssetTab;
