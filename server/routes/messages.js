const express = require("express");
const Message = require("../models/messageModel");
const {
  handleGetClanMessages,
  handleGetPersonalMessages,
  handleSendAttachment,
  handleSendMessage,
} = require("../controllers/messages.js");
const upload = require("../middlewares/multerMiddleware.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.get("/clan-messages/:id", authMiddleware, handleGetClanMessages);
router.get("/personal-messages/:id", authMiddleware, handleGetPersonalMessages);
router.post(
  "/attachment",
  upload.array("files", 5),
  authMiddleware,
  handleSendAttachment
);
router.post("/sendmessage/clan/:clanid", authMiddleware, handleSendMessage);
router.post(
  "/sendmessage/personal/:friendId",
  authMiddleware,
  handleSendMessage
);

module.exports = router;
