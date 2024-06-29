const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    clanrequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clans",
    },
  },
  {
    timestamps: true,
  }
);

const requests = new mongoose.model("requests", requestSchema);

module.exports = requests;
