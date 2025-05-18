import React from "react";
import { LuArrowRight } from "react-icons/lu";
// import moment from 'momen
import TransactionInfoCard from "./TransactionInfoCard"; // Make sure this import exists

function RecentTransctions({ transactions, onSeeMore }) {
  return (
    <div>
      <div className="card">
        <div className="flex items-center justify-between">
          <h4 className="text-lg">Recent Transctions</h4>
          <button className="card_btn" onClick={onSeeMore}>
            see all <LuArrowRight />
          </button>
        </div>
        <div className="mt-6">
          {transactions?.slice(0, 5)?.map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.type === "expense" ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format("DD MMM YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentTransctions;
