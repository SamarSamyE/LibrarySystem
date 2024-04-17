const borrowedBooksModel=require("../Models/borrowedBooksModel");
const bookModel =require ("../Models/bookModel");
const borrowedBooksController ={};
const moment = require('moment');


const fs = require('fs');
const json2csv = require('json2csv').parse;
const exceljs = require('exceljs');



borrowedBooksController.addBorrowedBook = (req, res) => {
    const { book_id, borrower_id,due_date} = req.body;
    if (moment(due_date).isBefore(moment(), 'day')) {
        res.status(400).json({ message: 'Due date should be in the future' });
        return;
    }
    bookModel.getBookById(book_id, (err, book) => {
        if (err) {
            res.status(500).send('Error checking book availability');
            return;
        }
        if (!book || book.available_quantity < 1) {
            res.status(400).json({ message: 'Book not available for borrowing' });
            return;
        }
        
        const newBorrowedBook = {
        book_id,
        borrower_id,
        due_date,
        borrowing_date : new Date()
        };
    borrowedBooksModel.addBorrowedBook(newBorrowedBook, (err, result) => {
            if (err) {
              res.status(500).send('Error adding new borrowedBook');
              return;
            }
            if(book && book.available_quantity >=1 ){
                book.available_quantity--;
                bookModel.updateBook(book_id, book, (err, updatedBook) => {
                    if (err) {
                        res.status(500).send('Error updating book quantity');
                        return;
                    }
                })
            }
              res.json({ message: 'borrowedBook added successfully', borrowedBookId: result.borrowedBookId });
            });
          });
};


borrowedBooksController.getAllBorrowedBooks =(req,res) =>{
    borrowedBooksModel.getAllBorrowedBooks((err,results)=>{
        if(err){
            res.status(500).send('Error fetching borrowed books');
            return;
        } 
        res.json(results);
    })
};

borrowedBooksController.returnAborrowedBook = (req, res) => {
    const borrowerId = req.query.borrowerId;
    const bookId = req.query.bookId;

    borrowedBooksModel.getBorrowedBookByBookIdAndBorrowerId(borrowerId,bookId,(err, results) => {
        if (err) {
            res.status(500).send('Error getting Borrowed Book');
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: "Book is not borrowed by the specified borrower." });
            return;
        }
        const borrowedBook = results[0];
        const currentDate = new Date();
        if (currentDate > borrowedBook.due_date) {
            console.log('The book was returned late.');
            //We may need add logic here
        }
    borrowedBooksModel.updateReturnDateForBorrowedBook(borrowedBook.id,(err,updatedBorrowedBook)=>{
        if (err) {
             res.status(500).send('Error updating Borrowed Book');
            return;
            }
        }) 
        bookModel.getBookById(bookId, (err, book) => {
            if (err) {
                res.status(500).send('Error getting book');
                return;
            }
            if(book){
                book.available_quantity++;
                bookModel.updateBook(bookId, book, (err, updatedBook) => {
                    if (err) {
                        res.status(500).send('Error updating book quantity');
                        return;
                    }
                })
            }
        })       
        res.json("return book done successfuly");
    })
};


borrowedBooksController.getAllBorrowedBooksByBorrower=(req,res) =>{
    const borrowerId=req.params.borrowerId;
    borrowedBooksModel.getAllBorrowedBooksByBorrower (borrowerId ,(err, borrowedBooks) =>{
        if (err){
            res.status(500).send('Error fetching borrowed books by borrower ID');
            return; 
        }
        res.json(borrowedBooks);
    });
};



borrowedBooksController.listOverdueBooks = (req, res) => {
    const currentDate = moment().startOf('day'); 

    borrowedBooksModel.getOverdueBooks(currentDate, (err, overdueBooks) => {
        if (err) {
            console.error('Error retrieving overdue books:', err);
            res.status(500).send('Error retrieving overdue books');
            return;
        }
        
        res.json(overdueBooks);
    });
};


// Function to get borrowing statistics within a specific period
borrowedBooksController.getBorrowingStatistics = (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400).json({ message: 'Please provide both start date and end date' });
        return;
    }
    borrowedBooksModel.getBorrowedBooksByPeriod(startDate, endDate, (err, borrowedBooks) => {
        if (err) {
            res.status(500).send('Error retrieving borrowed books');
            return;
        }
        const totalBorrowedBooks = borrowedBooks.length;
        res.json({ startDate,endDate,totalBorrowedBooks });
    });
};





borrowedBooksController.exportBorrowingDataToXlsx = (req, res) => {
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

        borrowedBooks.forEach(book => {
            worksheet.addRow(book);
        });

        // Write Xlsx data to file
        const filePath = 'borrowing_data.xlsx';
        workbook.xlsx.writeFile(filePath)
            .then(() => {
                // Send the Xlsx file as response
                res.download(filePath);
            })
            .catch(err => {
                console.error('Error writing Xlsx file:', err);
                res.status(500).send('Error exporting borrowing data to Xlsx');
            });
    });
};


module.exports=borrowedBooksController;