const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilepicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  console.log(this);
  if (!this.username) {
    this.username = this.email.split("@")[0];
  }

  next();
});

const users = mongoose.model("users", userSchema);

module.exports = users;
