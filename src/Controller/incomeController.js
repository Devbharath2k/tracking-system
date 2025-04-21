import Income from '../Model/incomeModel.js';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import logger from '../Utils/logger.js';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const IncomeController = {
    // Add Income
    addIncome: async (req, res) => {
        try {
            const { icon, source, amount, date } = req.body;

            if (!source || !amount || !date) {
                logger.warn("All fields are required");
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "All fields are required",
                    success: false
                });
            }

            const newIncome = new Income({
                icon,
                source,
                amount,
                date: new Date(date),
                userId: req.user
            });

            await newIncome.save();

            logger.info(`Successfully created a new income: ${newIncome._id}`);
            return res.status(StatusCodes.CREATED).json({
                message: "Successfully created new income",
                success: true,
                income: newIncome
            });
        } catch (error) {
            logger.error(`Internal server error: ${error.message}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                success: false
            });
        }
    },

    // Get All Income
    allIncome: async (req, res) => {
        try {
            const income = await Income.find({ userId: req.user }).sort({ createdAt: -1 });

            if (!income || income.length === 0) {
                logger.warn(`No income found`);
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "No income data found",
                    success: false
                });
            }

            logger.info(`Successfully retrieved all income`);
            return res.status(StatusCodes.OK).json({
                message: "All income data retrieved",
                income,
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

    // Delete Income
    deleteIncome: async (req, res) => {
        try {
            const deleteId = req.params.id;
            const income = await Income.findByIdAndDelete(deleteId);

            if (!income) {
                logger.warn(`Income not found for deletion`);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Income not found",
                    success: false
                });
            }

            logger.info(`Successfully deleted income with ID: ${deleteId}`);
            return res.status(StatusCodes.OK).json({
                message: "Successfully deleted income",
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
    downloadexcelsheet: async (req, res) => {
        try {
            const income = await Income.find({ userId: req.user }).sort({ createdAt: -1 });
    
            if (!income || income.length === 0) {
                logger.warn(`No income data to export`);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "No income data to export",
                    success: false
                });
            }
    
            const data = income.map(item => ({
                source: item.source,
                icon : item.icon,
                amount: item.amount,
                date: item.date
            }));
    
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(wb, ws, 'Income');
    
            const folderPath = path.join(process.cwd(), 'My-income-Excel');
            const fileName = `income_sheet_${Date.now()}.xlsx`;
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
                // Optionally clean up file after download
                // fs.unlink(filePath, () => {});
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

export default IncomeController;
