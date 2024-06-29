const User = require("../models/usersModel");
const asyncHandler=require("../utils/asyncHandler")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");



const handleUserRegistration=asyncHandler(async (req,res,next)=>{
    const {firstname,lastname,email,password}=req.body;
    
    if([firstname,lastname,email,password].some((field)=> field?.trim()==="")){
        throw new Error("All fields are required.")
    }


    const user=await User.findOne({email})
    if(user) throw new Error(`User already registered with this email ${email}`);
    
    
    const salt=await  bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
      

    
    const newuser=new User({
        firstname,
        lastname,
        email,
        password:hashedPassword
    })
    await newuser.save();


    res.status(201).send({
        success:true,
        message:"User created succesfully."
    })

})


const handleUserLogin=asyncHandler(async (req,res,next)=>{
       
 const {email,password}=req.body;

 if(!email || !password){
    throw new Error("Email & Password is required!");
 }

 const user=await User.findOne({email});

 if(!user) throw new Error("User not found!");
 


 const validPassword=await bcrypt.compare(password,user.password);
 
 if(!validPassword) throw new Error("Password is invalid.");

 const token=jwt.sign({userId:user._id},process.env.TOKEN_SECRET,{expiresIn:"1d"});


res.status(200).cookie("token",token).send({
    success:true,
    message:"User Logged In successfully.",
    token:token,
})


})



const handleGetCurrentUser=asyncHandler(async(req,res,next)=>{
    
      const currentuser=await User.findById(req.body.userId);

      if(!currentuser) throw new Error("User not found!");

      res.status(200).send({
        success:true,
        message:"User fetched succesfully.",
        data:currentuser,
      })

})


module.exports={
    handleUserRegistration,
    handleUserLogin,
    handleGetCurrentUser
}