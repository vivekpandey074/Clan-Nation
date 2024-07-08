const User = require("../models/usersModel");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinaryconfig.js");
const fs = require("fs");
const ApiError = require("../utils/ApiError.js");
const Request = require("../models/requestModel.js");
const { emitEvent } = require("../utils/features.js");

const handleUserRegistration = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (
    [firstname, lastname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new Error("All fields are required.");
  }

  const user = await User.findOne({ email });
  if (user) throw new Error(`User already registered with this email ${email}`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newuser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  await newuser.save();

  res.status(201).send({
    success: true,
    message: "User created succesfully.",
  });
});

const handleUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(500, "Email & Password is required!");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(500, "User not found!");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new ApiError(401, "Password is invalid.");

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).cookie("token", token).send({
    success: true,
    message: "User Logged In successfully.",
    token: token,
  });
});

const handleGetCurrentUser = asyncHandler(async (req, res) => {
  const currentuser = await User.findById(req.body.userId);

  if (!currentuser) throw new ApiError(500, "User not found!");

  res.status(200).send({
    success: true,
    message: "User fetched succesfully.",
    data: currentuser,
  });
});

const handleAvatarUpload = async (req, res) => {
  try {
    const response = await cloudinary.uploader.upload(req.file.path, {
      folder: "ClanNation",
    });

    const userId = req.body.userId;

    await User.findByIdAndUpdate(userId, {
      $set: { profilepicture: response.secure_url },
    });

    fs.unlinkSync(req.file.path);
    // this will make sure once file get upload to cloudinary it get removed from serverlocalstorage

    res.send({
      success: true,
      message: "Image Uploaded successfully",
      url: response.secure_url,
    });
  } catch (err) {
    fs.unlinkSync(req.file.path); // this will make sure once file get upload to cloudinary it get removed from serverlocalstorage
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const handleSearchUser = asyncHandler(async (req, res) => {
  const { username } = req.query;

  const users = await User.find({
    username: { $regex: username, $options: "i" },
  });

  res.send({
    success: true,
    message: "search completed",
    users,
  });
});

const handleSendRequest = asyncHandler(async (req, res) => {
  const { clanID, receiverID } = req.body;

  const request = await Request.find({
    $or: [
      {
        sender: req.body.userId,
        receiver: receiverID,
      },
      {
        sender: receiverID,
        receiver: req.body.userId,
      },
      {
        sender: req.body.userId,
        clanrequest: clanID,
      },
    ],
  });

  if (request && request.length >= 1)
    throw new ApiError(401, "Request already sent");

  let requestObj = { sender: req.body.userId };
  if (clanID) requestObj = { ...requestObj, clanrequest: clanID };
  if (receiverID) requestObj = { ...requestObj, receiver: receiverID };

  await Request.create(requestObj);

  emitEvent(req, "NEW_REQUEST", [receiverID]);

  return res.status(200).send({
    success: true,
    message: "Request sent successfully",
  });
});

const handleAcceptRequest = asyncHandler(async (req, res) => {
  const { requestID, accept } = req.body;

  const request = await Request.findById(requestID);

  if (!request) throw new ApiError(404, "Request not found");

  if (request.receiver.toString() !== req.body.userId.toString())
    throw new ApiError(401, "Not authorized to accept the request");

  await request.updateOne({
    $set: {
      status: accept === "true" ? "accepted" : "rejected",
    },
  });

  res.status(200).send({
    success: true,
    message: `Request ${accept === "true" ? "accepted" : "rejected"}`,
  });
});
module.exports = {
  handleUserRegistration,
  handleUserLogin,
  handleGetCurrentUser,
  handleAvatarUpload,
  handleSearchUser,
  handleSendRequest,
  handleAcceptRequest,
};
