const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

const bodyParser=require("body-parser");
app.use(bodyParser.json());

const borrowerRoutes = require("./Routes/borrowRoutes");
const bookRoutes=require("./Routes/bookRoutes");
const borrowedBooksRoutes=require("./Routes/borrowedBooksRoutes");
const reportsRoutes=require("./Routes/reportsRoutes");


app.use('/borrower', borrowerRoutes);
app.use('/book', bookRoutes);
app.use('/borrowerBooks', borrowedBooksRoutes);
app.use('/reports', reportsRoutes);


app.listen(PORT,()=>{
    console.log("http://localhost:"+PORT);
  });