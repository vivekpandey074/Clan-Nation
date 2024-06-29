const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  clan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clans",
  },
  role: {
    type: String,
    enum: ["leader", "co-leader", "elder", "member"],
    default: "member",
  },
});
