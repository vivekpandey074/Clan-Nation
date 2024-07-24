const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/messageModel");
const Clan = require("../models/clanModel");
const User = require("../models/usersModel");
const ApiError = require("../utils/ApiError");

const handleSendAttachment = asyncHandler(async (req, res) => {
  const { clanID, receiverID } = req.body;

  const sender = await User.findById(req.body.userId);

  if (!sender) throw new ApiError(404, "Sender not found.");

  // const [clan,sender,receiver]=await Promise.all([
  //       Clan.findById(clanID),
  //       User.findById(req.body.userId),
  //       User.findById(receiverID),
  // ])

  const files = req.files || [];

  if (files.length < 1) throw new ApiError(400, "Please attach attachment.");

  // uploading on cloudinary

  const attachments = [];

  let messageForDB = {
    sender: req.body.userId,
    content: " ",
    attachments,
  };

  messageForDB = clanID
    ? { ...messageForDB, clan: clanID }
    : { ...messageForDB, receiver: receiverID };

  //message for db
  const message = await Message.create(messageForDB);

  //message for realtime || socket
  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: sender._id,
      name: sender.name,
      profilepicture: sender.profilepicture,
    },
  };

  // currently i dont know about this. 3:10:30
  const participants = [];

  //below event will alert the count of messages on chatbox
  // emitEvent(req, "NEW_ATTACHMENT_ALERT", participants, { clanID });

  // below event will alert for new message
  // emitEvent(req,"NEW_ATTACHMENT",participants,{clanID})

  res.status(200).send({
    success: true,
    message,
  });
});

const handleGetClanMessages = asyncHandler(async (req, res) => {
  const clanID = req.params.id;
  const { page = 1 } = req.query;

  const result_per_page = 5;
  const skip = (page - 1) * result_per_page;

  const [messages, totalMessageCount] = await Promise.all([
    Message.find({ clan: clanID })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(result_per_page)
      .populate("sender", "username profilepicture")
      .lean(),
    Message.countDocuments({ clan: clanID }),
  ]);
  // lean allow to treat message as vanilla js object and not as mongoose model.

  const totalPages = Math.ceil(totalMessageCount / result_per_page);
  res.status(200).send({
    success: true,
    message: "Message retrieved successfully.",
    messages: messages.reverse(),
    totalPages,
  });
});

const handleGetPersonalMessages = asyncHandler(async (req, res) => {
  const receiver = req.params.id;
  const { page = 1 } = req.query;

  const result_per_page = 5;
  const skip = (page - 1) * result_per_page;

  const [messages, totalMessageCount] = await Promise.all([
    Message.find({
      $or: [
        { sender: req.body.userId, receiver: receiver },
        { sender: receiver, receiver: req.body.userId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(result_per_page)
      .populate("sender receiver", "username profilepicture")
      .lean(),
    Message.countDocuments({
      $or: [
        { sender: req.body.userId, receiver: receiver },
        { sender: receiver, receiver: req.body.userId },
      ],
    }),
  ]);

  const totalPages = Math.ceil(totalMessageCount / result_per_page);

  res.status(200).send({
    success: true,
    message: "Message retrieved successfully.",
    messages: messages.reverse(),
    totalPages,
  });
});

const handleSendMessage = asyncHandler(async (req, res) => {
  const { clanid, friendId } = req.params;
  const { content } = req.body;

  let messageObj;
  if (clanid) {
    messageObj = {
      sender: req.body.userId,
      clan: clanid,
      content,
    };
  } else if (friendId) {
    messageObj = {
      sender: req.body.userId,
      receiver: friendId,
      content,
    };
  }

  const message = await Message.create(messageObj);

  const newmessage = await Message.findById(message._id).populate("sender");
  res.send({
    success: true,
    message: "Message sent",
    newmessage,
  });
});

module.exports = {
  handleGetClanMessages,
  handleGetPersonalMessages,
  handleSendAttachment,
  handleSendMessage,
};
