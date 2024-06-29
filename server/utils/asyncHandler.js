const asyncHandler=(fn)=>{
      return async (req,res,next)=>{
              try{
                  await fn(req,res,next);
              }catch(err){
                res.status(err.code || 500).send({
                    status:false,
                    message:err.message,
                })

              }
         
      }

}


module.exports=asyncHandler;