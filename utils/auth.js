exports.isLoggedIn=(req,res,next)=>{
    if (req.isAuthenticated()) {
        next()
      } else {
        res.redirect("/users/login")
      }
}

exports.verifyUser=(req,res,next)=>{
  if(req.user.role == "owner"){
    next()
  }else{
    res.redirect("/profile")
  }
}
exports.verifyCustomer=(req,res,next)=>{
  if(req.user.role == "customer"){
    next()
  }else{
    res.redirect("/profile")
  }
}
exports.verifyCustomerFood=(req,res,next)=>{
  if(req.user.role == "customer"){
    next()
  }else{
    res.redirect("/profile/foodItems")
  }
}