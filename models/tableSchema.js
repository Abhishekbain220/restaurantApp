let mongoose=require("mongoose")
let tableSchema=mongoose.Schema({
    members:Number,
    date:String,
    from:String,
    to:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"}

})

module.exports=mongoose.model("table",tableSchema)