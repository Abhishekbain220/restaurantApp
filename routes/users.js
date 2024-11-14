var express = require('express');
var router = express.Router();
let User = require("../models/userSchema")
let passport = require("passport")
let LocalStrategy = require("passport-local")
passport.use(new LocalStrategy(User.authenticate()))
let { isLoggedIn } = require("../utils/auth");
const { sendMail } = require('../utils/mail');
let Email=require("../models/emailSchema")
let Order=require("../models/orderSchema")
/* GET users listing. */
router.get('/register',async function   (req, res, next) {
  let email=await Email.find()
  console.log(email[0])
  res.render("register", {
    user:req.user,
    email:email[0]
  })
});
router.post('/register', async function (req, res, next) {
  let { username, email, role, password } = req.body
  let newUser = await User.register({
    username,
    email,
    role
  }, password)
  await newUser.save()
  let sEmail=await Email.findOne()
  if(!sEmail && newUser.role == "owner"){
    let newEmail=await Email.create({
      ownersMail:newUser.email,
      ownerToken:1
    })
    await newEmail.save()
  }

  else if(sEmail && newUser.role == "owner"){
    sEmail.ownersMail=newUser.email,
    sEmail.ownerToken=1

    await sEmail.save()
  }
  res.redirect("/users/login")
});
router.get('/login', async function (req, res, next) {
  res.render("login", {
    user:req.user
  })
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/users/login"
}), async function (req, res, next) {

});
router.get('/logout', isLoggedIn, async function (req, res, next) {
  
  req.logOut(() => {
    res.redirect("/users/login")
  })
});
router.get('/updateUser', isLoggedIn, async function (req, res, next) {
  res.render("updateUser", {
    user: req.user
  })
});
router.post('/updateUser/:uid', isLoggedIn, async function (req, res, next) {
  await User.findByIdAndUpdate(req.params.uid, req.body)
  res.redirect("/profile")
});
router.get('/resetPassword', isLoggedIn, async function (req, res, next) {
  res.render("resetPassword", {
    user: req.user
  })
});
router.post('/resetPassword', isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(req.body.oldPassword, req.body.newPassword)
    await req.user.save()
    res.redirect("/users/updateUser")

  } catch (error) {
    console.log(error.message)
  }
});
router.get('/forgetEmail', async function (req, res, next) {
  res.render("forgetEmail", {
    user:req.user
  })
});
router.post('/forgetEmail', async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email })
  if (user) {
    let url = `${req.protocol}://${req.get("host")}/users/forgetPassword/${user._id}`
    sendMail(user, url, res)
    user.resetPasswordToken = 1
    await user.save()
    } 
    else {
    res.send("This Email Address is not registerd")
  }
});
router.get('/forgetPassword/:uid', async function (req, res, next) {
  res.render("forgetPassword", {
    uid: req.params.uid,
    user:req.user
  })
});
router.post('/forgetPassword/:uid', async function (req, res, next) {
  let user = await User.findById(req.params.uid)
  if (user.resetPasswordToken == 1) {
    await user.setPassword(req.body.newPassword)
    user.resetPasswordToken=0
    await user.save()

    res.redirect("/users/login")
  } else {
    res.send("Session Time Out")
  }
});



module.exports = router;
