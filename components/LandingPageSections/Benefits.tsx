import React from "react";
import { BenefitCard } from "./BenefitCard";
import {Zap, Shield, BarChart} from "lucide-react";

const Benefits = () => {
    const benefits = [
        {
          icon: <Zap className="h-6 w-6" />,
          title: "Lightning Fast",
          description:
            "Our optimized platform delivers exceptional performance with minimal latency.",
        },
        {
          icon: <Shield className="h-6 w-6" />,
          title: "Enterprise Security",
          description:
            "Bank-level security with end-to-end encryption and advanced threat protection.",
        },
        {
          icon: <BarChart className="h-6 w-6" />,
          title: "Detailed Analytics",
          description:
            "Gain valuable insights with comprehensive data visualization tools.",
        },
    ]
  return (
    <section className="pt-19 bg-white min-h-[850px]  overflow-x-clip pb-5">
      <div className="px-5 py-2">
        <div className="max-w-[850px] mx-auto">
          <div className="flex  justify-center">
            <div className="tag">Why Use Our Platform?</div>
          </div>
          <div className="mt-3 flex flex-col justify-center items-center mb-10">
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
             The Amazing Benefits We Offered
            </h2>
          </div>

        </div>

        {/*Feature Section*/}
        <div className="min-w-[900px] flex justify-center items-center mt-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
