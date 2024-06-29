const jwt=require("jsonwebtoken");
const asyncHandler=require("../utils/asyncHandler");

const authMiddleware=asyncHandler(async (req,res,next)=>{

  const token=req.headers.authorization.split(" ")[1];


  const decryptedtoken=jwt.verify(token,process.env.TOKEN_SECRET)



  req.body.userId=decryptedtoken.userId


next();


})


module.exports=authMiddleware