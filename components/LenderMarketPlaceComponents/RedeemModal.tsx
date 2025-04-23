"use client";
import { useState } from 'react';
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import SuccessModal from './SuccessModal';

const RedeemModal = ({isModalOpen, setIsModalOpen, selectedReward, userPoints, rewardPoints, setUserPoints}: any) => {
     const [redeemQuantity, setRedeemQuantity] = useState(1);
     const [isSuccessModaOpen, setIsSuccessModalOpen] = useState(false);
     const handleRedeem = () => {
        if (!selectedReward) return;
    
        const totalCost = rewardPoints * redeemQuantity;
    
        if (userPoints >= totalCost) {
          setUserPoints(userPoints - totalCost);
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
        } else {
        }
      };
  return (
    <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
            <DialogDescription>
              You have {userPoints} points available. Each {selectedReward?.name} costs {selectedReward?.points} points.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center mt-2">
              <Button variant="outline" size="icon" onClick={() => setRedeemQuantity(Math.max(1, redeemQuantity - 1))}>
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                className="mx-2 text-center"
                value={redeemQuantity}
                onChange={(e) => setRedeemQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                min="1"
              />
              <Button variant="outline" size="icon" onClick={() => setRedeemQuantity(redeemQuantity + 1)}>
                +
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Total cost: {selectedReward ? rewardPoints * redeemQuantity : 0} points
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRedeem}>Confirm Redemption</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/*Success Modal*/}
      <SuccessModal isSuccessModalOpen = {isSuccessModaOpen} setIsSuccessModalOpen = {setIsSuccessModalOpen} redeemQuantity={redeemQuantity} rewardName = {selectedReward}
      userPoints = {userPoints}/>
    </>
  )
}

export default RedeemModal
