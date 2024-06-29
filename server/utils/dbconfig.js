const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_DB_URL)

const connection=mongoose.connection;

connection.on("connected",()=>{
    console.log("MongoDB connection successfull.")
})

connection.on("error",()=>{
    console.log("MongDB connection failed!")
})


module.exports=connection;

