import React from "react";
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2 } from "react-icons/lu";

function TransactionInfoCard({ title, icon, date, amount, type, hideDeleteBtn }) {
  return (
    <div className="group relative flex items-center gap-4 mt-3 p-3 rounded-lg hover:bg-gray-100/60">
      <div className="w-12 h-12 flex justify-center items-center text-xl text-gray-200 bg-gray-100 rounded-full">
        {icon ? <img src={icon} alt={title} className="w-6 h-6" /> : <LuUtensils />}
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-semibold">{title}</h5>
        <p className="text-xs text-red-500">{date}</p>
      </div>
      <div className={`text-sm font-semibold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
        {type === "income" ? "+" : "-"}${amount}
      </div>
      {!hideDeleteBtn && (
        <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <LuTrash2 />
        </button>
      )}
    </div>
  );
}

export default TransactionInfoCard;
