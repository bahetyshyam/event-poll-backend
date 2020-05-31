import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

userSchema.statics.validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export default mongoose.model("User", userSchema);
