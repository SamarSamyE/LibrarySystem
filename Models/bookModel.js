const db=require("../dbConnection");

const bookModel={};


bookModel.getAllBooks =(callback) =>{
    const query =`SELECT * FROM book`;
    db.query (query, (err , results) => {
      if(err){
        return callback(err, null);
      }
    return callback(null, results);
  });
};


//to check the unique ISBN
bookModel.getBookByISBN = (ISBN, callback) => {
  const query=`SELECT * FROM Book WHERE ISBN = ?`;
  db.query(query, [ISBN], (err, results) => {
    if (err){
      return callback(err, null);
    }
    if (results.lenght ==0){
      return callback(null, null);
    }
    return callback(null, results[0]);
  });
};


bookModel.getBookById =(bookId, callback) =>{
  const query =`SELECT * from book WHERE id = ?`;
  db.query(query, [bookId] , (err, results) => {
    if (err){
      return callback(err, null);
    }
    if (results.lenght ==0){
      return callback(null, null);
    }
    return callback(null, results[0]);
  });
};


bookModel.addBook = (book, callback) => {
    const query = 'INSERT INTO Book SET ?';
    db.query(query, book, (err, result) => {
      if (err) {
        return callback(err, null);
      }
       return callback(null, { bookId: result.insertId });
    });
};



bookModel.updateBook = (bookId, book, callback) => {
  const query = 'UPDATE book SET ? WHERE id = ?';
  db.query(query, [book, bookId], (err) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, { message: 'Book updated successfully' });
  });
};


bookModel.deleteBook = (bookId, callback) => {
  const query = 'DELETE FROM book WHERE id = ?';
  db.query(query, [bookId], (err) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, { message: 'Book deleted successfully' });
  });
};


bookModel.searchBooks = (params, callback) => {
  const { author, ISBN, title } = params;
  const conditions = [];
  const values = [];

  if (author) {
    conditions.push('author LIKE ?');
    values.push(`%${author}%`);
  }

  if (ISBN) {
    conditions.push('ISBN LIKE ?');
    values.push(`%${ISBN}%`);
  }

  if (title) {
    conditions.push('title LIKE ?');
    values.push(`%${title}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT *
    FROM book
    ${whereClause}
  `;

  db.query(query, values, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};


module.exports = bookModel;