import React from "react";

const AboutSection = () => {
 
  return (
    <section className="min-h-[850px] bg-gradient-to-b from-[#FFFFFF] to-[#b8c4f0] py-24 overflow-x-clip">
      <div className="px-5 py-2">
        {/*About Us Description*/}
        <div className="max-w-[850px] mx-auto">
          <div className="flex  justify-center">
            <div className="tag">Enhance Your Financial Wellness</div>
          </div>
          <div className="mt-3 flex flex-col justify-center items-center mb-5">
            <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
              {" "}
              An AI-Driven Decentralized <br /> Peer to Peer Microloan Ecosystem
            </h2>
            <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
              A comprehensive platform built to enable lenders to stake in loan
              pools for passive income, while providing borrowers with seamless
              access to DeFi-powered microloans for personal or business needs.
            </p>
          </div>
        
        </div>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto mt-5">

       
        <div className="mt-5 max-w-[1200px] ">
          
          </div>
          </div>
      </div>
    </section>
  );
};

export default AboutSection;