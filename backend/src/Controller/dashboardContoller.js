import Income from "../Model/incomeModel.js";
import Expense from "../Model/expenseModel.js";
import { isValidObjectId, Types } from "mongoose";

const Dashboard = {
  createDashboard: async (req, res) => {
    try {
      const userId = req.user;

      // if (!isValidObjectId(userId)) {
      //   return res.status(400).json({ message: "Invalid user ID" });
      // }

      const userObjectId = new Types.ObjectId(userId);

      // Total Income
      const totalIncomeResult = await Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalIncome = totalIncomeResult[0]?.total || 0;

      // Total Expense
      const totalExpenseResult = await Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalExpense = totalExpenseResult[0]?.total || 0;

      // Last 60 Days Income
      const last60DaysIncomeTransactions = await Income.find({
        userId: userId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      }).sort({ createdAt: -1 });

      const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
        (sum, txn) => sum + txn.amount,
        0
      );

      // Last 30 Days Expense
      const last30DaysExpenseTransactions = await Expense.find({
        userId: userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }).sort({ createdAt: -1 });

      const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce(
        (sum, txn) => sum + txn.amount,
        0
      );

      // Last 5 Transactions (Income + Expense)
      const last5Income = await Income.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

      const last5Expense = await Expense.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

      const recentTransactions = [
        ...last5Income.map((txn) => ({ ...txn.toObject(), type: "income" })),
        ...last5Expense.map((txn) => ({ ...txn.toObject(), type: "expense" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Only keep the latest 5 combined

      res.json({
        totalBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
        last30DaysExpense: {
          total: totalExpenseLast30Days,
          transactions: last30DaysExpenseTransactions,
        },
        last60DaysIncome: {
          total: totalIncomeLast60Days,
          transactions: last60DaysIncomeTransactions,
        },
        recentTransactions,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default Dashboard;
