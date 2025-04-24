"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const PaymentSuccessModal = ({
  currentPhaseData,
  showSuccessDialog,
  setShowSuccessDialog,
  currentPhase,
  confirmPayment,
}: any) => {

  const handleChange = () => {
    setShowSuccessDialog(false);
  };
  return (
    <>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              You are about to make a payment of $
              {currentPhaseData.amount.toLocaleString()} for Phase{" "}
              {currentPhase}: {currentPhaseData.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Once confirmed, this payment will be processed and you will move
              to the next phase of your business microloan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleChange()}>
              Cancel
            </Button>
            <Button onClick={confirmPayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default PaymentSuccessModal;
