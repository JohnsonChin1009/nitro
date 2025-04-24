import ChatArea from "@/components/ChatArea";
import React from "react";

const BorrowerDashboard = () => {
  return (
    <section className=" min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center mt-2">
        <div className="my-2 flex flex-col space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Borrower Dashboard</h1>
          <p className="text-gray-600 text-[15px]">Prompt to Start Your Microloan Application</p>
        </div>
        <hr/>
        <div className="my-5">
          <ChatArea />
          <div className="my-10 px-[160px]">
            <h2 className="font-bold text-xl">Summary Overview:</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BorrowerDashboard;
