import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    schedule: { type: Date },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      name: { type: String },
    },
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
