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
    clanlanguage: {
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
    open: {
      type: Boolean,
      default: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    clanlocation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
      enum: ["general", "chess", "codeforces"],
    },
  },
  {
    timestamps: true,
  }
);

const clans = mongoose.model("clans", clanSchema);

module.exports = clans;
