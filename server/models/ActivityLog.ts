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
      enum: ["POST_PUBLISHED", "AI_REPLY"],
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
