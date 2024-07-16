import mongoose from "mongoose";
import { Schema } from "mongoose";

const rolSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    maxlength: [50, "Name too long"],
    minlength: [3, "Name too short"],
  },
});

export const Rol = mongoose.model("Rol", rolSchema, "roles");
