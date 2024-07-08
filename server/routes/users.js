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
  handleAvatarUpload,
  handleSearchUser,
  handleSendRequest,
  handleAcceptRequest,
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

router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("avatar"),
  handleAvatarUpload
);

router.post("/sendrequest", authMiddleware, handleSendRequest);
router.put("/acceptrequest", authMiddleware, handleAcceptRequest);
module.exports = router;
