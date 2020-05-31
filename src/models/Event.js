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
        responses: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                value: { type: String, enum: ["yes", "no", "maybe"] },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
