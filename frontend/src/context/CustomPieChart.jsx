import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border px-3 py-2 rounded shadow text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function CustomPieChart({ data, colors, showTextAnchor = true }) {
  const totalAmount = data.reduce((acc, item) => acc + item.value, 0);
  const totalIncome = data.find((item) => item.name.toLowerCase() === "income")?.value || 0;
  const totalExpense = data.find((item) => item.name.toLowerCase() === "expense")?.value || 0;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-6">
      <h3 className="text-lg font-bold mb-4">Finance Summary</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={showTextAnchor}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors?.[index] || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>Total Balance:</strong> ${totalAmount.toLocaleString()}</p>
          <p><strong>Total Income:</strong> ${totalIncome.toLocaleString()}</p>
          <p><strong>Total Expense:</strong> ${totalExpense.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomPieChart;
