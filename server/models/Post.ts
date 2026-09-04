import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    platforms: [
      {
        type: String,
        enum: [
          "facebook",
          "instagram",
          "linkedin",
          "twitter",
          "youtube",
          "tiktok",
          "pinterest",
          "reddit",
          "bluesky",
          "threads",
        ],
        required: true,
      },
    ],
    scheduledFor: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model("Post", postSchema);
