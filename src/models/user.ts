import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Rol } from "./rol";

const userSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name too long"],
    minlength: [3, "Name too short"],
  },
  lastName: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name too long"],
    minlength: [3, "Name too short"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxlength: [30, "Username too long"],
    minlength: [3, "Username too short"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password too short"],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
    unique: true,
  },
  rol: {
    ref: Rol,
    type: Schema.Types.String,
    required: true,
    default: "anonymous",
  },
});

export const User = mongoose.model("User", userSchema, "users");
