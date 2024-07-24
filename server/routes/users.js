const router = require("express").Router();
const upload = require("../middlewares/multerMiddleware.js");
const {
  registerValidator,
  loginValidator,
  handleValidate,
} = require("../utils/validators.js");

const {
  handleUserLogin,
  handleUserRegistration,
  handleGetCurrentUser,
  handleUpdateUser,
  handleSearchUser,
  handleSendRequest,
  handleAcceptRequest,
  handleGetUserProfile,
  handleVerifyCodeforces,
  handleUserFriendStatus,
  handleUnfriend,
  handleAllNotifications,
} = require("../controllers/users");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/register",
  registerValidator(),
  handleValidate,
  handleUserRegistration
);
router.post("/login", loginValidator(), handleValidate, handleUserLogin);
router.get("/get-current-user", authMiddleware, handleGetCurrentUser);
router.get("/search", authMiddleware, handleSearchUser);
router.get("/profile/:id", authMiddleware, handleGetUserProfile);
router.get("/friendStatus", authMiddleware, handleUserFriendStatus);
router.get("/all-notifications", authMiddleware, handleAllNotifications);

router.patch(
  "/update/:id",
  authMiddleware,
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "profileImg", maxCount: 1 },
  ]),
  handleUpdateUser
);

router.post("/verify-codeforces", authMiddleware, handleVerifyCodeforces);

router.post("/sendrequest", authMiddleware, handleSendRequest);
router.post("/unfriend", authMiddleware, handleUnfriend);
router.put("/acceptrequest", authMiddleware, handleAcceptRequest);

module.exports = router;
