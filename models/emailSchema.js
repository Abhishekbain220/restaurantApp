let mongoose=require("mongoose")
let emailSchema=mongoose.Schema({
    ownersMail:String,
    ownerToken:{
        type:Number,
        default:0
    }

    

})

module.exports=mongoose.model("email",emailSchema)