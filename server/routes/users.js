const router=require("express").Router();
const {handleUserLogin,handleUserRegistration, handleGetCurrentUser}=require("../controllers/users")
const authMiddleware=require("../middlewares/authMiddleware")


router.post("/register",handleUserRegistration);
router.post("/login",handleUserLogin);
router.get("/get-current-user",authMiddleware,handleGetCurrentUser);

module.exports=router;