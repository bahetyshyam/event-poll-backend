import mongoose from "mongoose";
import Joi from "@hapi/joi";

const userSchema = mongoose.Schema({
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

userSchema.statics.validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports = mongoose.model("User", userSchema);
