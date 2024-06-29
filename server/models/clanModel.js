const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
      default: "English",
    },
    points: {
      type: Number,
      default: 0,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    Open: {
      type: Boolean,
      default: false,
    },
    Leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
  },
  {
    timestamps: true,
  }
);

const clans = mongoose.model("clans", clanSchema);

module.exports = clans;
