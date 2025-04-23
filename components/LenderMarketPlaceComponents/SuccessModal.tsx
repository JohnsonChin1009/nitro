"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const SuccessModal = ({
  isSuccessModalOpen,
  setIsSuccessModalOpen,
  redeemQuantity,
  rewardName,
  userPoints,
}: any) => {
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };
  return (
    <>
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redemption Successful!</DialogTitle>
            <DialogDescription>
              You have successfully redeemed {redeemQuantity}{" "}
              {rewardName}
              {redeemQuantity > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Award className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-center">
              Your new balance is <strong>{userPoints}</strong> points.
            </p>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Our team will process your redemption and contact you with further
              details.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={closeSuccessModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuccessModal;
