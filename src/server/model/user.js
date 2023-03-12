const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: false,
    default: "local",
  },
  snsId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
