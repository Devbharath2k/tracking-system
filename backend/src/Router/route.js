import Userprofiler from "../Controller/userController.js";
import incomeController from "../Controller/incomeController.js";
import ExpenseController from "../Controller/expenseController.js";
import Dashboard from "../Controller/dashboardContoller.js";
import express from "express";
import { Authorization } from "../Middleware/generateToken.js";
import {profilephotoUpload} from '../Utils/multer.js';
const router = express.Router();

router.post('/api/register', profilephotoUpload, Userprofiler.register);
router.post('/api/login', Userprofiler.login);
router.post('/api/update', Authorization, Userprofiler.updateprofile);
router.post('/api/forgotpassword', Userprofiler.forgotpassword);
router.post('/api/verfiypassword', Userprofiler.verfiypassword);
router.post('/api/resetpassword', Userprofiler.resetpassword);
router.post('/api/logout', Authorization, Userprofiler.logout);
router.get('/api/getuser', Authorization, Userprofiler.getUserinfo);

router.post('/api/createIncome', Authorization, incomeController.addIncome);
router.get('/api/allincome', Authorization, incomeController.allIncome);
router.delete('/api/deleteIncome/:id', Authorization, incomeController.deleteIncome);
router.get('/api/downloadincome', Authorization, incomeController.downloadexcelsheet)

router.post('/api/create/expense', Authorization, ExpenseController.createExpense);
router.get('/api/allexpense', Authorization, ExpenseController.getAllExpense);
router.delete('/api/deleteExpense/:id', Authorization, ExpenseController.deleteExpense);
router.get('/api/downloadExpense', Authorization, ExpenseController.downloadExcelSheet);

//dashboard transcration: )
router.get('/api/dashboard',Dashboard.createDashboard )


export default router;