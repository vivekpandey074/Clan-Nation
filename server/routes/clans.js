const router=require("express").Router();


router.get("/allclans",(req,res)=>{
    res.send({
        status:true,
        message:"All clans"
    })
})




module.exports=router;