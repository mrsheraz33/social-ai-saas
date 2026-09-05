import { Response, NextFunction } from "express";
import { ActivityLog } from "../models/ActivityLog.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const getActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const activity = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10).populate("relatedPost", "content")

    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
};

