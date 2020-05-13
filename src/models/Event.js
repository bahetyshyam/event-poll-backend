import mongoose, { Schema } from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    schedule: {
        type: Date
    },
    location: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        locationName: {
            type: String
        }
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    yes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    no: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    maybe: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

export default mongoose.model("Event", eventSchema);
