import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    response: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);
