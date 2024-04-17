
const fs = require('fs');
const json2csv = require('json2csv').parse;
const exceljs = require('exceljs');
const borrowedBooksModel=require("../Models/borrowedBooksModel");
const reports={};

// Function to export borrowing data to CSV
reports.exportBorrowingDataToCSV = (req, res) => {
    const { startDate, endDate } = req.query;

    // Query borrowed books within the specified period
    borrowedBooksModel.getBorrowedBooksByPeriod(startDate, endDate, (err, borrowedBooks) => {
        if (err) {
            console.error('Error retrieving borrowed books:', err);
            res.status(500).send('Error retrieving borrowed books');
            return;
        }

        // Convert borrowed books data to CSV format
        const csv = json2csv(borrowedBooks);

        // Write CSV data to file
        fs.writeFileSync('borrowing_data.csv', csv);

        // Send the CSV file as response
        res.download('borrowing_data.csv');
    });
};




// Function to export borrowing data to Xlsx
reports.exportBorrowingDataToXlsx = (req, res) => {
    const { startDate, endDate } = req.query;

    // Query borrowed books within the specified period
    borrowedBooksModel.getBorrowedBooksByPeriod(startDate, endDate, (err, borrowedBooks) => {
        if (err) {
            console.error('Error retrieving borrowed books:', err);
            res.status(500).send('Error retrieving borrowed books');
            return;
        }

        // Create a new workbook
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Borrowing Data');

        // Add borrowed books data to worksheet
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Borrower ID', key: 'borrower_id', width: 15 },
            { header: 'Book ID', key: 'book_id', width: 15 },
            { header: 'Borrowing Date', key: 'borrowing_date', width: 20 },
            { header: 'Due Date', key: 'due_date', width: 20 },
            { header: 'Return Date', key: 'return_date', width: 20 }
        ];

        borrowedBooks.forEach(borrowedBook => {
            worksheet.addRow(borrowedBook);
        });

        // Write Xlsx data to file
        const filePath = 'borrowing_data.xlsx';
        workbook.xlsx.writeFile(filePath)
            .then(() => {
                res.download(filePath);
            })
            .catch(err => {
                console.error('Error writing Xlsx file:', err);
                res.status(500).send('Error exporting borrowing data to Xlsx');
            });
    });
};



reports.exportOverdueBorrowedBooksForLastMonthToCSV = (req, res) => {
    borrowedBooksModel.getOverdueBorrowedBooksForLastMonth((err, borrowedBooks) => {
        if (err) {
            console.error('Error retrieving borrowed books:', err);
            res.status(500).send('Error retrieving borrowed books');
            return;
        }

        // Convert borrowed books data to CSV format
        const csv = json2csv(borrowedBooks);
        fs.writeFileSync('overdue_data.csv', csv);
        res.download('overdue_data.csv');
    });
};


reports.exportAllBorrowingProcessForLastMonthToCSV = (req, res) => {
    borrowedBooksModel.getAllBorrowingProcessForLastMonth((err, borrowedBooks) => {
        if (err) {
            console.error('Error retrieving borrowed books:', err);
            res.status(500).send('Error retrieving borrowed books');
            return;
        }

        // Convert borrowed books data to CSV format
        const csv = json2csv(borrowedBooks);
        fs.writeFileSync('borrowing_process_data.csv', csv);
        res.download('borrowing_process_data.csv');
    });
};

module.exports=reports;

