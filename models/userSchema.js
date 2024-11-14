let mongoose=require("mongoose")
let plm=require("passport-local-mongoose")
let userSchema=mongoose.Schema({
    username:String,
    email:String,
    role:{
        type:String,
        enum:["owner","customer"]
    },
    password:String,
    resetPasswordToken:{
        type:Number,
        default:0
    },
    cart:[{type:mongoose.Schema.Types.ObjectId,ref:"food"}],
    order:[{type:mongoose.Schema.Types.ObjectId,ref:"order"}],
    food:[{type:mongoose.Schema.Types.ObjectId,ref:"food"}]
    

})

userSchema.plugin(plm)
module.exports=mongoose.model("user",userSchema)