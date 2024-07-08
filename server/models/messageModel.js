const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    clan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clans",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    content: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const messages = mongoose.model("messages", messageSchema);

module.exports = messages;
