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
    const { platform, handle, avatarUrl } = req.body;

    const account = await Account.create({ platform, handle, avatarUrl });
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
