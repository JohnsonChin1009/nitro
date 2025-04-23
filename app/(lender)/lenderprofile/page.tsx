import React from "react";
import ProfileHeader from "@/components/LenderProfileComponent/LenderProfileHeader";
import { RecentActivity } from "@/components/LenderProfileComponent/RecentActivity";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PoolsTab from "@/components/LenderProfileComponent/PoolsTab";
import ImpactTab from "@/components/LenderProfileComponent/ImpactTab";
import PerksTab from "@/components/LenderProfileComponent/PerksTab";
import AchievementCard from "@/components/LenderProfileComponent/AchievementCard";

const Profile = () => {
  return (
    <section className=" py-5 min-h-screen min-w-[1100px]">
      <div className="px-[50px] w-full flex flex-col justify-center mt-2">
          <ProfileHeader />
        <div className="grid grid-cols-6 gap-6 mt-2  ]">
          {/*Left Column*/}
          <div className="col-span-4">
            <div className="  rounded-2xl  mt-4">
              <Tabs defaultValue="pools" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="pools">Pools</TabsTrigger>
                  <TabsTrigger value="perks">Perks</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>

                <PoolsTab />
                <PerksTab/>
                <ImpactTab />
              </Tabs>
            </div>
          </div>
          {/*Right Column*/}
          <div className="col-span-2">
            {/*Recent Activites*/}
            <div className="mb-5 flex flex-col space-y-4 py-3">
              <div className="bg-white rounded-3xl border py-2 px-2">
                <div className="py-3 px-3">
                  <h1 className="font-bold my-2 px-2 text-xl text-black">
                    Recent Activities
                  </h1>
                </div>
                <RecentActivity />
              </div>
              <div>
                <AchievementCard />
              </div>
            </div>
            {/*Badges*/}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
