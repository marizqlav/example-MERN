import mongoose from "mongoose";
import { Schema } from "mongoose";

const gameSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    maxlength: [50, "Name can't be longer than 50 characters"],
    minlength: [2, "Name can't be shorter than 2 characters"],
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: ["Acción", "Aventura", "Puzzle", "Estrategia", "Terror"],
  },
  //nuevo campo para la imagen
  image: { type: Buffer, required: false },
});

export const Game = mongoose.model("Game", gameSchema, "games");
