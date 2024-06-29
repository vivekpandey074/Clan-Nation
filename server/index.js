const express=require("express");
require('dotenv').config()
const chats=require("./data");
const cors=require("cors")
const app=express();
const userRouter=require("./routes/users");
const dbconfig=require("./utils/dbconfig");
const authMiddleware = require("./middlewares/authMiddleware");
const clanRouter=require("./routes/clans")



const PORT=process.env.PORT || 5000;


app.use(cors());



app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use("/api/users",userRouter)
app.use("/api/clans",authMiddleware,clanRouter)


app.get("/api/chat/:id",(req,res)=>{
    const chat=chats.find((c)=> c._id===req.params.id);
    res.send(chat);
})

app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`)
})
