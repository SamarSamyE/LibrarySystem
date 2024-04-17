const express = require('express');
const router = express.Router();
const borrowedBooksController=require("../Controllers/borrowedBooksController");

router.post('',borrowedBooksController.addBorrowedBook);

router.get('',borrowedBooksController.getAllBorrowedBooks);
router.put('/return',borrowedBooksController.returnAborrowedBook);
router.get('/over_due_books',borrowedBooksController.listOverdueBooks);

router.get('/:borrowerId',borrowedBooksController.getAllBorrowedBooksByBorrower);

module.exports=router;