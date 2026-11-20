import { Request, Response, NextFunction } from "express";
import { Account } from "../models/Account.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import zernio from "../config/zernio.js";

export const getUserAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const accounts = await Account.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: accounts.length,
      accounts,
    });
  } catch (error) {
    next(error);
  }
};

export const addAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { platform, handle, avatarUrl } = req.body;
    if (!platform || !handle) {
      res.status(400).json({ success: false, message: "Platform and handle are required" });
      return;
    }
    const account = await Account.create({
      platform, handle, avatarUrl, user: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Account added successfully",
      account,
    });
  } catch (error) {
    next(error);
  }
};

export const disconnectAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!account) {
      res.status(404).json({
        success: false,
        message: "Account not found",
      });
      return;
    }

    if (account.zernioAccountId) {
      try {
        await zernio.accounts.deleteAccount({
          path: { accountId: account.zernioAccountId },
        });
      } catch (zernioError: any) {
        console.warn(
          "Failed to delete account from Zernio, proceeding with DB removal:",
          zernioError?.message || zernioError,
        );
      }
    }

    await account.deleteOne();

    res.status(200).json({
      success: true,
      message: "Account disconnected successfully",
    });
  } catch (error) {
    next(error);
  }
};
