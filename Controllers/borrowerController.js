const borrowerModel=require("../Models/borrowerModel")
const borrowerController = {};

// Controller method to get all borrowers
borrowerController.getAllborrowers = (req, res) => {
borrowerModel.getAllBorrowers((err, results) => {
    if (err) {
      res.status(500).send('Error fetching borrowers');
      return;
    }
    res.json(results);
  });
};


// Controller method to get a borrower by ID
borrowerController.getBorrowerById = (req, res) => {
    const borrowerId = req.params.id;
    borrowerModel.getBorrowerById(borrowerId, (err, borrower) => {
      if (err) {
        res.status(500).send('Error fetching borrower by ID');
        return;
      }
  
      if (!borrower) {
        res.status(404).send('borrower not found');
        return;
      }
  
      res.json(borrower);
    });
  };


  borrowerController.addBorrower = (req, res) => {
    const { name, email} = req.body;
    const newborrower = {
        name,
        email,
        registared_date: new Date()
    };
  
    borrowerModel.addBorrower(newborrower, (err, result) => {
            if (err) {
              res.status(500).send('Error adding new borrower');
              return;
            }
              res.json({ message: 'borrower added successfully', borrowerId: result.borrowerId });
          });
};
  



  // Controller method to update a borrower by ID
borrowerController.updateBorrower = (req, res) => {
    const borrowerId = req.params.id; 
    const borrower = {
      name: req.body.name,
      email: req.body.email,
    };
  
    borrowerModel.updateBorrower(borrowerId, borrower, (err, result) => {
      if (err) {
        res.status(500).send('Error updating borrower');
        return;
      }
  
      res.json(result);
    });
  };
  

// Controller method to delete a borrower by ID
borrowerController.deleteBorrower = (req, res) => {
    const borrowerId = req.params.id;
    borrowerModel.deleteBorrower(borrowerId, (err, borrower) => {
      if (err) {
        res.status(500).send('Error deelte borrower by ID'+err);
        return;
      }
  
      if (!borrower) {
        res.status(404).send('borrower not found');
        return;
      }
  
      res.json(borrower);
    });
  };

module.exports=borrowerController;