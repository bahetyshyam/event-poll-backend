import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
