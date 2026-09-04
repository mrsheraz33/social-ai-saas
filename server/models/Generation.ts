import { Schema, model } from "mongoose";

const generationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
    },
    tone: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const Generation = model("Generation", generationSchema);