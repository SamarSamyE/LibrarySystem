const db=require("../dbConnection");

const borrowedBooksModel={};

borrowedBooksModel.addBorrowedBook=(borrowedBook,callback) =>{
    const query=`INSERT INTO borrowedbooks SET ?`;
    db.query(query,borrowedBook, (err,result) =>{
        if(err){
            console.error('Error executing MySQL query:', err);
            return callback(err, null); 
        }
        return callback(null, {borrowedBookId: result.insertId}) ;
    });
};


borrowedBooksModel.getAllBorrowedBooks=(callback) =>{
    const query = `SELECT id, borrower_id, book_id, CONVERT_TZ(due_date,'+00:00','+02:00') AS due_date, CONVERT_TZ(borrowing_date,'+00:00','+02:00') AS borrowing_date
    FROM borrowedbooks`;
    db.query(query, (err,results) =>{
        if(err){
            return callback(err, null);
        }
        return callback(null,results);
    })
};


borrowedBooksModel.getAllBorrowedBooksByBorrower=(borrowerId,callback) =>{
    const query = `SELECT id, borrower_id, book_id, CONVERT_TZ(due_date,'+00:00','+02:00') AS due_date,CONVERT_TZ(borrowing_date,'+00:00','+02:00') AS borrowing_date
    FROM borrowedbooks  where borrower_id =?`;
    db.query(query, [borrowerId],(err,results) =>{
        if(err){
            return callback(err, null);
        }
        return callback(null,results);
    })
};

borrowedBooksModel.deleteBorrowedBook = (borrowedBookId, callback) => {
    const query = `DELETE FROM borrowedbooks where id = ?`;
    db.query(query, [borrowedBookId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return callback(err, null);
        }
        callback(null, { message: 'Borrowed Book deleted successfully' });
    });
};

borrowedBooksModel.getBorrowedBookByBookIdAndBorrowerId= (borrowerId,bookId,callback) =>{
    const query= `SELECT id,CONVERT_TZ(due_date, '+00:00', '+02:00') AS due_date from borrowedbooks where borrower_id =? AND book_id=?`;
    db.query(query,[borrowerId,bookId], (err,results) =>{
        if (err) {
            console.error('Error executing MySQL query:', err);
            return callback(err, null);
        }
        return callback(null,results);
    });
};


borrowedBooksModel.updateReturnDateForBorrowedBook =(borrowedBookId,callback)=>{
    const query=`UPDATE borrowedbooks SET return_date=CURDATE() WHERE id=?`;
    db.query(query,[borrowedBookId],(err,results) =>{
        if (err) {
            console.error('Error executing MySQL query:', err);
            return callback(err, null);
        }
        callback(null, { message: 'return date updated successfully'});
    })

}; 

borrowedBooksModel.getOverdueBooks = (currentDate, callback) => {
    const query = 'SELECT id, borrower_id, book_id, CONVERT_TZ(due_date, \'+00:00\', \'+02:00\') AS due_date,CONVERT_TZ(borrowing_date,\'+00:00\',\'+02:00\') AS borrowing_date FROM borrowedbooks WHERE due_date < ?';
    db.query(query, [currentDate.toDate()], (err, overdueBooks) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, overdueBooks);
    });
};



borrowedBooksModel.getBorrowedBooksByPeriod = (startDate, endDate, callback) => {
    const query = ` SELECT * FROM BorrowedBooks WHERE borrowing_date >= ? AND borrowing_date <= ?`;
    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


borrowedBooksModel.getOverdueBorrowedBooksForLastMonth = ( callback) => {
    const query = ` SELECT *  FROM BorrowedBooks  WHERE return_date IS NULL
      AND due_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()`;
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


borrowedBooksModel.getAllBorrowingProcessForLastMonth = ( callback) => {
    const query = ` SELECT * FROM BorrowedBooks  WHERE borrowing_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()`;
    db.query(query, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};




module.exports=borrowedBooksModel;


