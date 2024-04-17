const db=require("../dbConnection");
const borrowerModel = {};

 borrowerModel.getAllBorrowers = (callback) => {
    const columns = ['id', 'name', 'email', 'registared_date'];
    const query = `SELECT ${columns.join(',')} FROM Borrower`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  };


  borrowerModel.getBorrowerById = (borrowerId, callback) => {
    const query = 'SELECT * FROM borrower WHERE id = ?';
  
    db.query(query, [borrowerId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
  
      if (results.length === 0) {
        return callback(null, null);
      }
      return callback(null, results[0]);
    });
  };



  borrowerModel.addBorrower = (borrower, callback) => {
    const query = 'INSERT INTO borrower SET ?';
  
    db.query(query, borrower, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
  
      // Return the ID of the newly added borrower
      return callback(null, { borrowerId: result.borrowerId });
    });
  };


  borrowerModel.updateBorrower = (borrowerId, borrower, callback) => {
    const query = 'UPDATE borrower SET ? WHERE id = ?';
  
    db.query(query, [borrower, borrowerId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
  
      return callback(null, { message: 'borrower updated successfully' });
    });
  };


  borrowerModel.deleteBorrower = (borrowerId, callback) => {
    const query = 'DELETE FROM borrower WHERE id = ?';
    db.query(query, [borrowerId], (err) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
  
      return callback(null, { message: 'borrower deleted successfully' });
    });
  };



module.exports = borrowerModel;