let mongoose=require("mongoose")

mongoose.connect("mongodb+srv://res123:res123@cluster0.gsgs3bg.mongodb.net/res?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Database Connection Established")
})
.catch((err)=>{
    console.log(err.message)
})