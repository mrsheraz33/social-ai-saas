import { Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      required: true,
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
        "threads"
      ],
    },
    handle: {
      type: String,
      required: true,
    },
    zernioAccountId: {
      type: String,
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    tokenExpiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["connected", "disconnected", "expired"],
      default: "connected",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ user: 1, zernioAccountId: 1 }, { unique: true, sparse: true });

export const Account = model("Account", accountSchema);