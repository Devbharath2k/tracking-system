import React from "react";

function InfoCard({ icon, label, value, color = "bg-blue-500" }) {
  return (
    <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/500">
      <div
        className={`w-14 h-14 flex justify-center items-center text-[26px] text-white ${color} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-500 mb-2">{label}</h6>
        <h6 className="text-[22px]">${value}</h6>
      </div>
    </div>
  );
}

export default InfoCard;
