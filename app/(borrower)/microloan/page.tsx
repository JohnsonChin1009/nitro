import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BorrowerStats from "@/components/BorrowerMicroloanComponent/MainPage/BorrowerStats";
import { BorrowerMicroloanCard } from "@/components/BorrowerMicroloanComponent/MainPage/BorrowerMicroLoanCard";

const MicroLoan = () => {
  return (
    <section className=" py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center">
        <div className=" space-y-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl ">
            Microloan Analytics Dashboard
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Track all your microloans successfully applied, and financial health
            impacts
          </p>
        </div>
        <hr className="my-5" />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Borrower Financial Health Statistics</CardTitle>
              <CardDescription>
                Key metrics on borrower financial status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BorrowerStats />
            </CardContent>
          </Card>
        </div>
        <div className="my-3">
          <BorrowerMicroloanCard />
        </div>
      </div>
    </section>
  );
};

export default MicroLoan;
