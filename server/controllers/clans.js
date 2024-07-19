const Clan = require("../models/clanModel");
const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/messageModel.js");
const { emitEvent, deleteFilesFromCloudinary } = require("../utils/features");
const router = express.Router();
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError.js");
const User = require("../models/usersModel.js");

const handleCreateClan = asyncHandler(async (req, res) => {
  const { name, description, clanlanguage, clanlocation, open, category } =
    req.body;

  const clan = await Clan.find({ name });
  if (clan) throw new ApiError(400, "Clan already exist.");

  const members = [req.body.userId];

  await Clan.create({
    name,
    description,
    clanlanguage,
    clanlocation,
    members,
    open,
    leader: req.body.userId,
    category,
  });

  //below code is not required for now. but it has to be implemented.

  // // this event is for all the members which will triggerd on clan creation and tell everybody that group is created/
  // emitEvent(req, "ALERT", members, `Welcome to ${name} clan.`);

  // //this event  will group members that group is created by someone and you have been added.
  // emitEvent(req,"REFETCH",members);

  res.send({
    success: true,
    message: `Clan ${name.trim()} created successfully.`,
  });
});

const handleSearchClan = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const { page = 1 } = req.query;

  const result_per_page = 5;
  const skip = (page - 1) * 5;

  let clans = [];
  let totalResults = [];
  if (query === "") {
    [clans, totalResults] = await Promise.all([
      Clan.find({}).skip(skip).limit(result_per_page),
      Clan.countDocuments({}),
    ]);
  } else {
    [clans, totalResults] = await Promise.all([
      Clan.find({
        name: { $regex: query, $options: "i" },
      })
        .skip(skip)
        .limit(result_per_page),
      Clan.countDocuments({
        name: { $regex: query, $options: "i" },
      }),
    ]);
  }

  const totalPages = Math.ceil(totalResults / result_per_page);

  await res.status(200).send({
    success: true,
    message: "search completed",
    clans,
    totalPages,
  });
});

const handleClanDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const clan = await Clan.findById(id).populate("members");
  if (!clan) throw new ApiError(404, "Clan not found.");

  res.status(200).send({
    success: true,
    message: "Clan details fetched successfully.",
    clan,
  });
});

const handleUpdateClan = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (req.body.name) throw new ApiError(400, "Clan name cannot be changed.");
  if (req.body.leader) throw new ApiError(400, "Leader cannot be changed.");

  const user = await User.findById(req.body.userId);
  if (!user) throw new ApiError(404, "Current user not found.");

  const clan = await Clan.findById(id);
  if (!clan) throw new ApiError(404, "Clan not found.");

  if (clan.leader.toString() !== user._id)
    throw new ApiError(400, "Only clan leader can update clan settings.");

  await Clan.findByIdAndUpdate(id, req.body);

  await res.status(200).send({
    success: true,
    message: "Clan Settings updated successfully.",
  });
});

const handleDeleteClan = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(req.body.userId);
  if (!user) throw new ApiError(404, "Current user not found.");

  const clan = await Clan.findById(id);
  if (!clan) throw new ApiError(404, "Clan not found.");

  if (clan.leader.toString() !== user._id)
    throw new ApiError(400, "Only clan leader can delete the clan.");

  //We have to delete all messages as well as attachment or files from cloudinary.
  const members = clan.members;

  const messagesWithAttachment = await Message.find({
    clan: id,
    attachments: { $exists: true, $ne: [] },
  });

  //these are cloudinary public ids, yes we have to delete from there also.:)
  const publicIds = [];

  messagesWithAttachment.forEach((message) => {
    message.attachments.forEach((attachment) => {
      publicIds.push(attachment.public_id);
    });
  });

  await Promise.all([
    deleteFilesFromCloudinary(publicIds),
    Message.deleteMany({ clan: id }),
    clan.deleteOne(),
  ]);

  emitEvent(req, "REFETCH_CHATS", members);
  res.send({
    success: true,
    message: "Clan deleted successfully.",
  });
});

const handleJoinedClans = asyncHandler(async (req, res) => {
  const joinedclans = await Clan.find({ members: req.body.userId })
    .select({
      name: 1,
      lastMessage: 1,
      members: 1,
    })
    .populate("members");

  res.send({
    success: true,
    message: "All joined clans data retrieved.",
    joinedclans,
  });
});

const handleOwnClans = asyncHandler(async (req, res) => {
  const ownclans = await Clan.find({ leader: req.body.userId })
    .select({
      name: 1,
      lastMessage: 1,
      members: 1,
    })
    .populate("members");

  res.send({
    success: true,
    message: "My clans fetched successfully.",
    ownclans,
  });
});

const handleAddNewMember = asyncHandler(async (req, res) => {
  const { newMember, clanId } = req.body;
  console.log(newMember, clanId);
  if (
    !mongoose.Types.ObjectId.isValid(newMember) ||
    !mongoose.Types.ObjectId.isValid(clanId)
  ) {
    throw new ApiError(400, "Invalid id format.");
  }

  const newMemberObj = await User.findById({ _id: newMember });

  if (!newMemberObj) {
    throw new ApiError(404, "User to be added  not found.");
  }

  const clan = await Clan.findById({ _id: clanId });

  if (!clan) {
    throw new ApiError(404, "Clan not found");
  }

  if (!clan.open) throw new ApiError(400, "Clan is closed.");

  if (clan.members.length >= 50) throw new ApiError(400, "Clan is full.");

  if (clan.members.includes(newMember)) {
    throw new ApiError(409, "User already joined.");
  }

  clan.members.push(newMember);

  const updatedClan = await clan.save();

  emitEvent(
    req,
    "ALERT",
    clan.members,
    `${newMemberObj.username} joined the clan.`
  );

  emitEvent(req, "REFETCH", clan.members);

  res.status(200).send({
    success: true,
    message: `${newMemberObj.username} joined the clan`,
  });
});

const handleRemoveMember = asyncHandler(async (req, res) => {
  const { memberID, clanID } = req.body;

  // Validate clanID and memberID
  if (
    !mongoose.Types.ObjectId.isValid(clanID) ||
    !mongoose.Types.ObjectId.isValid(memberID)
  ) {
    throw new ApiError(400, "Invalid id format.");
  }

  const memberObj = await User.findById({ _id: memberID });

  if (!memberObj) throw new ApiError(401, "User to be removed not found.");

  const clan = await Clan.findById({ _id: clanID });

  if (!clan) throw new ApiError(400, "Clan not found.");

  if (clan.leader.toString() !== req.body.userId)
    throw new ApiError(400, "Only clan leader can remove members.");

  if (!clan.members.includes(memberID))
    throw new ApiError(400, `${memberObj.username} is not in the clan.`);

  const updatedMembersList = clan.members.filter(
    (user) => user._id.toString() !== memberID
  );

  const updatedClan = await Clan.findByIdAndUpdate(
    clanID,
    { members: updatedMembersList },
    { new: true }
  );

  emitEvent(
    req,
    "ALERT",
    updatedClan.members,
    `${memberObj.username} has been removed from clan.`
  );

  emitEvent(req, "REFETCH_CHATS", updatedClan.members);

  res.status(200).send({
    success: true,
    message: `${memberObj.username} removed from the clan`,
  });
});

const handleLeaveClan = asyncHandler(async (req, res) => {
  const clanID = req.params.id;

  const user = await User.findById(req.body.userId);

  if (!user) throw new ApiError(400, "User not found");

  const clan = await Clan.findById(clanID);

  if (!clan) throw new ApiError(404, "Clan not found");

  const remainingMember = clan.members.filter(
    (user) => user._id.toString() !== req.body.userId.toString()
  );

  if (remainingMember.length === clan.members.length)
    throw new ApiError(
      400,
      `${user?.username} is no more part of ${clan.name}.`
    );

  if (clan.leader.toString() === req.body.userId.toString()) {
    if (clan.members.length === 1) throw new ApiError(400, "Cannot leave clan");

    const randomLeaderIndex = Math.floor(
      remainingMember.length * Math.random()
    );

    const randomLeader = remainingMember[randomLeaderIndex];

    clan.leader = randomLeader;
  }

  clan.members = remainingMember;

  clan.save();

  emitEvent(
    req,
    "ALERT",
    remainingMember,
    `${user?.username} has left the group.`
  );
  res.send({
    success: true,
    message: `Succesfully left ${clan.name}.`,
  });
});

//delete clan,update clan.

module.exports = {
  handleCreateClan,
  handleSearchClan,
  handleJoinedClans,
  handleOwnClans,
  handleAddNewMember,
  handleRemoveMember,
  handleLeaveClan,
  handleUpdateClan,
  handleClanDetails,
  handleDeleteClan,
};
