const express = require('express')
const router = express.Router()
const Customer = require('../db/customer')


router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
  
      const newCustomer = new Customer({
        name,
      });
  
      const savedCustomer = await newCustomer.save();
  
      res.json(savedCustomer);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });

  router.get('/allusers',async(req,res) => {
    try {
      const getallcustomer = await Customer.find()
      res.status(200).json({getallcustomer})
    } catch (error) {
      console.log(erorr);
    }
   
  })
  
  
  
  module.exports = router;