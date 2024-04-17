const express = require('express');
const borrowerController = require("../Controllers/borrowerController");

const router = express.Router();

router.get('', borrowerController.getAllborrowers );
router.get('/:id', borrowerController.getBorrowerById );
router.post('', borrowerController.addBorrower );
router.put('/:id', borrowerController.updateBorrower );
router.delete('/:id', borrowerController.deleteBorrower );


module.exports=router;