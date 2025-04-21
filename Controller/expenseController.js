import Expense from "../Model/expenseModel.js";
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs'; // You missed this in your code
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
dotenv.config();
import logger from "../Utils/logger.js";

const ExpenseController = {
    createExpense: async (req, res) => {
        try {
            const { icon, amount, source, date } = req.body;

            if (!amount || !source || !date) {
                logger.warn("All fields are required");
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "All fields are required",
                    success: false
                });
            }

            const expense = await Expense.create({
                icon,
                source,
                date: new Date(date),
                amount,
                userId: req.user
            });

            logger.info("Successfully created expense");
            return res.status(StatusCodes.CREATED).json({
                message: "Expense created successfully",
                expense,
                success: true
            });
        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                success: false
            });
        }
    },

    getAllExpense: async (req, res) => {
        try {
            const expenses = await Expense.find({ userId: req.user }).sort({ createdAt: -1 });

            if (!expenses.length) {
                logger.warn("No expenses found");
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "No expenses found",
                    success: false
                });
            }

            logger.info("Successfully fetched all expenses");
            return res.status(StatusCodes.OK).json({
                message: "Expenses fetched successfully",
                expenses,
                success: true
            });
        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                success: false
            });
        }
    },

    deleteExpense: async (req, res) => {
        try {
            const expenseId = req.params.id;
            const expense = await Expense.findByIdAndDelete(expenseId);

            if (!expense) {
                logger.warn("Expense not found or already deleted");
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Expense not found",
                    success: false
                });
            }

            logger.info("Successfully deleted expense");
            return res.status(StatusCodes.OK).json({
                message: "Expense deleted successfully",
                expense,
                success: true
            });
        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                success: false
            });
        }
    },

    downloadExcelSheet: async (req, res) => {
        try {
            const expenses = await Expense.find({ userId: req.user }).sort({ createdAt: -1 });

            if (!expenses.length) {
                logger.warn("No expense data to export");
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "No expense data to export",
                    success: false
                });
            }

            const data = expenses.map(item => ({
                Source: item.source,
                Icon: item.icon || '',
                Amount: item.amount,
                Date: item.date.toISOString().split('T')[0]
            }));

            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(wb, ws, 'Expenses');

            const folderPath = path.join(process.cwd(), 'My-expense-Excel');
            const fileName = `expense_sheet_${Date.now()}.xlsx`;
            const filePath = path.join(folderPath, fileName);

            fs.mkdirSync(folderPath, { recursive: true });
            xlsx.writeFile(wb, filePath);

            res.download(filePath, fileName, err => {
                if (err) {
                    logger.error(`File download failed: ${err.message}`);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: "Failed to download file",
                        success: false
                    });
                }

                // Optional: delete file after sending
                fs.unlink(filePath, () => {});
            });

        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                success: false
            });
        }
    }
};

export default ExpenseController;
