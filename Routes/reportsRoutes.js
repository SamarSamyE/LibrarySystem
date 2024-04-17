const express = require('express');
const router = express.Router();
const reports=require("../Controllers/reports");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // Max requests per window
    message: 'Too many requests hit this IP, please try again later.'
  });
router.get('/specific_period_csv',limiter,reports.exportBorrowingDataToCSV);
router.get('/specific_period_xlsx',limiter,reports.exportBorrowingDataToXlsx);
router.get('/overdue_last_month',reports.exportOverdueBorrowedBooksForLastMonthToCSV);
router.get('/borrowing_process_last_month',limiter,reports.exportAllBorrowingProcessForLastMonthToCSV );

module.exports=router;