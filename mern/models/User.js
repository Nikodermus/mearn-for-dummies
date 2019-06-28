import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model("user", UserSchema);
