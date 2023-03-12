const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    unique: true,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  imageBase64: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

uploadSchema.methods.matchPassword = async (password) => {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const UploadModel = mongoose.model("Upload", uploadSchema);
module.exports = UploadModel;
