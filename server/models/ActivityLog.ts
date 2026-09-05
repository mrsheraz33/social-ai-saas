import { Schema, model } from "mongoose";

const activityLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: ["post_published", "ai_reply"],
    },
    description: {
      type: String,
      required: true,
    },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    platform: {
      type: String,
    },
    aiGeneratedText: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const ActivityLog = model("ActivityLog", activityLogSchema);
