const express = require('express');
const router = express.Router();

const bookController=require("../Controllers/bookController");
router.get('',bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id',bookController.getBookById);
router.post('',bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);


module.exports=router;