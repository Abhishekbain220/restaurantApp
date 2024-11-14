let mongoose=require("mongoose")
let foodSchema=mongoose.Schema({
    foodName:String,
    foodPrice:Number,
    foodImage:String,


})

module.exports=mongoose.model("food",foodSchema)