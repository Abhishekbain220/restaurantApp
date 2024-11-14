var express = require('express');
var router = express.Router();
let { isLoggedIn, verifyUser, verifyCustomer, verifyCustomerFood } = require("../utils/auth")
let User = require("../models/userSchema")
let upload = require("../utils/multer")
let Food = require("../models/foodSchema")
let path = require("path")
let global = path.join(__dirname, "../", "public", "images")
let fs = require("fs")
let Order = require("../models/orderSchema")
let Table = require("../models/tableSchema")
let {sendMailCustomer}=require("../utils/customerMail")
let {sendMailOwner}=require("../utils/ownermail")
let Email = require("../models/emailSchema")

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render("bookTable", {
    user: req.user
  })
});
router.post('/', isLoggedIn, verifyCustomer, async function (req, res, next) {
  try {
    let { members, date, from, to } = req.body
    let newTable = await Table.create({
      members, date, from, to,
      user:req.user._id
    })
    await newTable.save()
    let email = await Email.find()
    console.log(email[0].ownersMail)

    sendMailCustomer(req.user, newTable, res)
    sendMailOwner(req.user, email[0].ownersMail,newTable, res)

  } catch (error) {
    console.log(error.message)
  }
});





module.exports = router;
