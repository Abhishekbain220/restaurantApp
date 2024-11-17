let mongoose=require("mongoose")

mongoose.connect("mongodb://0.0.0.0/res")
.then(()=>{
    console.log("Database Connection Established")
})
.catch((err)=>{
    console.log(err.message)
})