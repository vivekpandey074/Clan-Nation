const User = require("../models/usersModel");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinaryconfig.js");
const fs = require("fs");
const ApiError = require("../utils/ApiError.js");
const Request = require("../models/requestModel.js");
const { emitEvent } = require("../utils/features.js");
const axios = require("axios");
const { request } = require("http");
const {
  NEW_REQUEST,
  REFETCH_NOTIFICATIONS,
  REFETCH_PROFILE,
} = require("../constants/event.js");

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
  const currentuser = await User.findById(req.body.userId).populate("friends");

  if (!currentuser) throw new ApiError(500, "User not found!");

  res.status(200).send({
    success: true,
    message: "User fetched succesfully.",
    data: currentuser,
  });
});

const handleGetUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userProfile = await User.findById(id);

  if (!userProfile) throw new ApiError(500, "User not found!");

  res.status(200).send({
    success: true,
    message: "User fetched succesfully.",
    data: userProfile,
  });
});

const handleUpdateUser = async (req, res) => {
  try {
    var coverImg = req.files["coverImg"] ? req.files["coverImg"][0] : null;
    var profileImg = req.files["profileImg"]
      ? req.files["profileImg"][0]
      : null;
    const { id } = req.params;
    const { username, bio } = req.body;

    let coverImgUrl = "";
    if (coverImg) {
      coverImgUrl = await cloudinary.uploader.upload(coverImg.path, {
        folder: "ClanNation",
      });
    }
    let profileImgUrl = "";
    if (profileImg) {
      profileImgUrl = await cloudinary.uploader.upload(profileImg.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        bio,
        profilepicture: profileImgUrl.url,
        coverImage: coverImgUrl.url,
      },
      {
        new: true,
      }
    ).populate("friends");

    if (!updatedUser) throw new ApiError(404, "User not found");

    if (coverImg) fs.unlinkSync(coverImg.path);
    if (profileImg) fs.unlinkSync(profileImg.path);
    // // this will make sure once file get upload to cloudinary it get removed from serverlocalstorage

    res.send({
      success: true,
      message: "User updated succesfully",
      updatedUser,
    });
  } catch (err) {
    if (coverImg) fs.unlinkSync(coverImg.path);
    if (profileImg) fs.unlinkSync(profileImg.path);
    // this will make sure once file get upload to cloudinary it get removed from serverlocalstorage
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
        status: "pending",
      },
      {
        sender: receiverID,
        receiver: req.body.userId,
        status: "pending",
      },
      {
        sender: req.body.userId,
        clanrequest: clanID,
        status: "pending",
      },
    ],
  });

  if (request && request.length >= 1)
    throw new ApiError(401, "Request already sent");

  let requestObj = { sender: req.body.userId };
  if (clanID) requestObj = { ...requestObj, clanrequest: clanID };
  if (receiverID) requestObj = { ...requestObj, receiver: receiverID };

  const newrequest = await Request.create(requestObj);

  emitEvent(req, NEW_REQUEST, [receiverID], newrequest);

  return res.status(200).send({
    success: true,
    message: "Request sent successfully",
  });
});

const handleAcceptRequest = asyncHandler(async (req, res) => {
  const { requestID, accept, userId } = req.body;

  const request = await Request.findById(requestID);

  if (!request) throw new ApiError(404, "Request not found");

  if (request.receiver.toString() !== userId.toString())
    throw new ApiError(401, "Not authorized to accept the request");

  const sender = await User.findById(request.sender);

  if (!sender) throw new ApiError(404, "Sender not found");

  const me = await User.findById(userId);

  if (accept) {
    await sender.updateOne({
      $addToSet: {
        friends: userId,
      },
    });

    await me.updateOne({
      $addToSet: {
        friends: sender._id,
      },
    });
  }

  await request.updateOne({
    $set: {
      status: accept ? "accepted" : "rejected",
    },
  });

  emitEvent(req, REFETCH_NOTIFICATIONS, [userId]);
  emitEvent(req, REFETCH_PROFILE, [userId]);

  res.status(200).send({
    success: true,
    message: `Request ${accept ? "accepted" : "rejected"}`,
  });
});

const handleVerifyCodeforces = async (req, res) => {
  try {
    const { username } = req.body;

    const response = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );

    console.log(username);
    const response2 = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`
    );

    if (response2?.data?.result[0].problem?.name === "Watermelon") {
      await User.findByIdAndUpdate(req.body?.userId, {
        codeforces_account: username,
      });

      res.send({
        success: true,
        message: "User Connected to codeforces successfully.",
      });
    } else {
      throw new ApiError(
        400,
        "Can't find the submission for watermelon problem"
      );
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err?.response?.data?.comment || err.message,
    });
  }
};

const handleUserFriendStatus = asyncHandler(async (req, res) => {
  const { friendID } = req.query;
  const { userId } = req.body;

  const friend = await User.findById(friendID);

  if (!friend) throw new ApiError(400, "Profile not found");

  const friendsList = friend.friends;

  for (let index = 0; index < friendsList.length; index++) {
    if (friendsList[index].toString() === userId)
      return res.send({
        success: true,
        message: "friend status fetched successfully",
        friendStatus: "friend",
      });
  }

  const friendRequest = await Request.find({
    $or: [
      {
        sender: req.body.userId,
        receiver: friendID,
        status: "pending",
      },
      {
        sender: friendID,
        receiver: req.body.userId,
        status: "pending",
      },
    ],
  });

  res.send({
    success: true,
    message: "Friend Status fetched successfully",
    friendStatus: friendRequest.length >= 1 ? "pending" : "notfriend",
  });
});

const handleUnfriend = asyncHandler(async (req, res) => {
  const { friendID, userId } = req.body;

  const friend = await User.findById(friendID);
  if (!friend) throw new ApiError(400, `Profile not found`);

  const me = await User.findById(userId);

  const friendFriendList = friend.friends;
  const myFriendList = me.friends;

  const updatedFriendFriendList = friendFriendList.filter((item) => {
    return item.toString() !== userId;
  });

  const updateMyFriendList = myFriendList.filter((item) => {
    return item.toString() !== friendID;
  });

  await friend.updateOne({
    $set: {
      friends: updatedFriendFriendList,
    },
  });
  await me.updateOne({
    $set: {
      friends: updateMyFriendList,
    },
  });

  res.status(200).send({
    success: true,
    message: "Unfriend successfull",
  });
});

const handleAllNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const allrequests = await Request.find({
    receiver: userId,
    status: "pending",
  })
    .populate("sender receiver", "username ")
    .select("username");

  console.log(allrequests);
  res.send({
    success: true,
    message: "All notification fetched successfully",
    notifications: allrequests,
  });
});

module.exports = {
  handleUserRegistration,
  handleUserLogin,
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
};
