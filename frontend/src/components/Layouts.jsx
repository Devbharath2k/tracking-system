import React from "react";
import CARD_V2 from "../assets/CARD_V2.Webp";
import { LuTrendingUpDown } from "react-icons/lu";

function Layouts({ children }) {

  const StatsInfoCard = ({ icon, label, value, color }) => (
  <div className={`p-4 rounded-xl shadow-md text-white ${color} flex items-center gap-4`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
  
);
  return (
    <div className="flex w-screen h-screen">
      <div className="w-full md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-black text-lg font-medium">
          Monthly and Early Expense Tracker
        </h2>
        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-full bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-700 absolute top-[30%] right-[22%]" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />
        <div className="grid grid-cols-1 z-20 relative">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Tracking your Income & Expense"
            value="₹530,000"
            color="bg-indigo-500"
          />
        </div>
        <img
          src={CARD_V2}
          className="w-64 lg:w-[90%] absolute bottom1-10 shadow-blue-400/15 mt-34"
          alt="Card Visual"
        />
      </div>
    </div>
  );
}

export default Layouts;
