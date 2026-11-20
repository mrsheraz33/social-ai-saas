import { Response, NextFunction } from "express";
import { ActivityLog } from "../models/ActivityLog.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const getActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const activity = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10).populate("relatedPost", "content")

    res.status(200).json({ success: true, count: activity.length, activity });
  } catch (error) {
    next(error);
  }
};

