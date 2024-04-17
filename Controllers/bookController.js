const bookModel =require ("../Models/bookModel");
const bookController ={};

bookController.getAllBooks= (req,res) =>{
    bookModel.getAllBooks((err,results) =>{
        if(err){
          res.status(500).send('Error fetching books');
          return;
        } 
        res.json(results);
    });
};


bookController.getBookById =(req,res) =>{
 const bookId=req.params.id;
 bookModel.getBookById(bookId, (err, book) =>{
    if(err){
        res.status(500).send('Error fetching book by ID');
        return; 
    }
    if(!book){
        res.status(404).send('Book not found');
        return ;
    }
    res.json(book);
 });
};


bookController.addBook = (req, res) => {
  const {title,author,ISBN,available_quantity,shelf_location}=req.body;
  bookModel.getBookByISBN(ISBN, (err,book) =>{
    if (err) {
      res.status(500).send('Error checking book ISBN');
      return;
  }
  if (book ) {
      res.status(400).json({ message: 'ISBN already exist '});
      return;
  }

  const newBook = {
        title,
        author,
        ISBN,
        available_quantity,
        shelf_location
    };
  
    bookModel.addBook(newBook, (err, result) => {
      if (err) {
        res.status(500).send('Error adding new book');
        return;
      }
  
      res.json({ message: 'Book added successfully', bookId: result.bookId });
      });
    });
  };


  bookController.updateBook = (req, res) => {
    const bookId = req.params.id; 
    const book = {
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        available_quantity: req.body.available_quantity,
        shelf_location: req.body.shelf_location,
    };
  
    bookModel.updateBook(bookId, book, (err, result) => {
      if (err) {
        res.status(500).send('Error updating book');
        return;
      }
  
      res.json(result);
    });
  };


  bookController.deleteBook = (req, res) => {
    const bookId = req.params.id;
    bookModel.deleteBook(bookId, (err, book) => {
      if (err) {
        res.status(500).send('Error delete book by ID'+err);
        return;
      }
  
      if (!book) {
        res.status(404).send('Book not found');
        return;
      }
      res.json(book);
    });
  };


  bookController.searchBooks = (req, res) => {
    const searchParams = {
      author: req.query.author,
      ISBN: req.query.ISBN,
      title: req.query.title,
    };
  
    bookModel.searchBooks(searchParams, (err, results) => {
      if (err) {
        res.status(500).send('Error searching books');
        return;
      }
  
      res.json(results);
    });
  };

module.exports=bookController;