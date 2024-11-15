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
const Table = require("../models/tableSchema")
let Email = require("../models/emailSchema")

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {

  res.render("profile", {
    user: req.user

  })
});

router.get('/addItems', isLoggedIn, verifyUser, function (req, res, next) {
  res.render("addItems", {
    user: req.user
  })
});
router.post('/addItems', isLoggedIn, upload.single("foodImage"), verifyUser, async function (req, res, next) {
  try {
    let { foodName, foodPrice } = req.body
  let food = await Food.create({
    foodName,
    foodPrice,
    foodImage: req.file.filename,


  })
  res.redirect("/profile/foodItems")
  } catch (error) {
    console.log(error)
  }

});
router.get('/foodItems', isLoggedIn, async function (req, res, next) {
  let food = await Food.find()
  res.render("foodItems", {
    user: req.user,
    food
  })

});
router.get('/addToCart/:foodId', isLoggedIn, async function (req, res, next) {
  if (req.user.cart.includes(req.params.foodId)) {

  } else {

    await req.user.cart.push(req.params.foodId)
    let food = await Food.findById(req.params.foodId)
    let newOrder = await Order.create({
      foodName: food.foodName,
      foodPrice: food.foodPrice,
      foodImage: food.foodImage,
      foodId: food._id,
      user: req.user._id
    })
    await newOrder.save()
    await req.user.order.push(newOrder._id)
  }
  await req.user.save()
  res.redirect("/profile/onlineOrder")

});
router.get('/myCart', isLoggedIn, async function (req, res, next) {
  let user = await User.findById(req.user._id).populate("order")
  let BasePrice = 0
  user.order.forEach((elem) => {
    BasePrice += elem.foodPrice
  })

  res.render("myCart", {
    user,
    order: user.order,
    BasePrice
  })

});

router.get('/increment/:orderId/:foodId', isLoggedIn, verifyCustomer, async function (req, res, next) {

  let order = await Order.findById(req.params.orderId)
  let food = await Food.findById(req.params.foodId)
  order.quantity += 1
  order.foodPrice += food.foodPrice
  await order.save()
  res.redirect("/profile/myCart")



});
router.get('/decrement/:orderId/:foodId', isLoggedIn, verifyCustomer, async function (req, res, next) {

  let order = await Order.findById(req.params.orderId)
  let food = await Food.findById(req.params.foodId)
  if (order.quantity > 1) {
    order.quantity -= 1
    order.foodPrice -= food.foodPrice
  }
  await order.save()
  res.redirect("/profile/myCart")



});
router.get('/deleteOrder/:orderId/:foodId', isLoggedIn, verifyCustomer, async function (req, res, next) {

  let order = await Order.findById(req.params.orderId)
  await Order.findByIdAndDelete(req.params.orderId)
  req.user.cart = req.user.cart.filter((elem) => {
    return (
      elem != req.params.foodId
    )
  })
  req.user.order = req.user.order.filter((elem) => {
    return (
      elem != req.params.orderId
    )
  })
  await req.user.save()
  res.redirect("/profile/myCart")



});
router.get('/paymentPage', isLoggedIn, verifyCustomer, async function (req, res, next) {
  await Order.deleteMany({ user: req.user._id })
  req.user.order = req.user.order.filter((elem) => {
    return (
      elem == "hello"
    )
  })
  req.user.cart = req.user.cart.filter((elem) => {
    return (
      elem == "hello"
    )
  })

  await req.user.save()

  res.render("paymentPage", {
    user: req.user
  })



});

router.get('/thankyouPage', isLoggedIn, verifyCustomer, async function (req, res, next) {


  res.render("thankyouPage", {
    user: req.user
  })



});

router.get('/selectFood/:foodId', isLoggedIn, verifyUser, async function (req, res, next) {
  let food = await Food.findById(req.params.foodId)
  res.render("selectFood", {
    user: req.user,
    food
  })
});
router.get('/onlineOrder', isLoggedIn, verifyCustomer, async function (req, res, next) {
  let food = await Food.find()
  res.render("onlineOrder", {
    user: req.user,
    food
  })
});
router.get('/deleteFood/:foodId', isLoggedIn, verifyUser, async function (req, res, next) {
  let food = await Food.findByIdAndDelete(req.params.foodId)
  await fs.unlinkSync(path.join(global, food.foodImage))
  res.redirect("/profile/foodItems")
});
router.get('/updateFood/:foodId', isLoggedIn, verifyUser, async function (req, res, next) {
  let food = await Food.findById(req.params.foodId)
  res.render("updateFood", {
    user: req.user,
    food
  })
});
router.post('/updateFood/:foodId', isLoggedIn, upload.single("foodImage"), verifyUser, async function (req, res, next) {
  let food = await Food.findByIdAndUpdate(req.params.foodId, {
    foodName: req.body.foodName,
    foodPrice: req.body.foodPrice


  })
  let order=await Order.findOneAndUpdate({
    foodName:food.foodName
  },{
    foodName:req.body.filename,
    foodPrice:req.body.foodPrice
  })
  if (req.file) {
    fs.unlinkSync(path.join(global, food.foodImage))
    food.foodImage = req.file.filename
    order.foodImage=req.file.filename


  }
  await order.save()
  await food.save()

  res.redirect(`/profile/selectFood/${req.params.foodId}`)

});

router.get('/deleteUser', isLoggedIn, async function (req, res, next) {
  let user = await User.findByIdAndDelete(req.user._id)
  if (user.role == "customer") {
    await Order.deleteMany({ user: req.user._id })
    await Table.deleteMany({ user: req.user._id })


  } else {
    let email = await Email.find()
    email[0].ownersMail = ""
    email[0].ownerToken = 0
    await email[0].save()
    await Order.deleteMany({})
    await Table.deleteMany({})

    let food = await Food.find()
    if (food) {
      food.forEach(async (elem) => {
        await elem.deleteOne()
        fs.unlinkSync(path.join(global, elem.foodImage))

      })
    }
    let users = await User.find()
    users.forEach(async(elem)=>{
      elem.cart.splice(0,elem.cart.length)
      elem.order.splice(0,elem.order.length)
      await elem.save()
    })
  }

  res.redirect("/users/login")
});




module.exports = router;
