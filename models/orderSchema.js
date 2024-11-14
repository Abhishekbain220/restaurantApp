let mongoose=require("mongoose")
let orderSchema=mongoose.Schema({
    foodName:String,
    foodPrice:Number,
    foodImage:String,
    foodId:{type:mongoose.Schema.Types.ObjectId,ref:"food"},
    quantity:{
        type:Number,
        default:1
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"}

})

module.exports=mongoose.model("order",orderSchema)