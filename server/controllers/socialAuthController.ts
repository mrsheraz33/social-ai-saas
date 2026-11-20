import zernio from "../config/zernio.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Account } from "../models/Account.js";
import { User } from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const getOrCreateZernioProfile = async (user: any): Promise<string> => {
  try {
    // 1. Check if user already has a saved profile ID
    if (user.zerniProfileId) {
      return user.zerniProfileId;
    }

    const result = await zernio.profiles.listProfiles();
    const data = result.data as any;
    const profiles: any[] = Array.isArray(data)
      ? data
      : data?.profiles || data?.data || [];

    // 2. Find profile matching user's ID or Email, else take/create one
    const userProfile = profiles.find(
      (p) => p.name === `${user.name || user.email}'s workspace` || p.name === user.email
    );

    if (userProfile) {
      const pid = userProfile._id || userProfile.id;
      await User.findByIdAndUpdate(user._id, { zerniProfileId: pid });
      return pid;
    }

    // 3. Create a unique profile for THIS user if not found
    const createdResult = await zernio.profiles.createProfile({
      body: { name: `${user.name || user.email}'s workspace` } as any,
    });

    const created = (createdResult.data as any)?.profile || createdResult.data;
    const pid = created?._id || created?.id;

    if (!pid) {
      throw new Error("Failed to create zernio profile - no ID returned!");
    }

    await User.findByIdAndUpdate(user._id, { zerniProfileId: pid });
    return pid;
  } catch (error: any) {
    console.error("getOrCreateZernioProfile Error:", error?.message || error);
    throw error;
  }
};

export const generateConnectUrl = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const { platform } = req.params;
    const profileId = await getOrCreateZernioProfile(req.user);

    const origin = req.get("origin") || "http://localhost:5173";
    const redirectUrl = `${origin}/accounts`;

    const result = await zernio.connect.getConnectUrl({
      path: { platform: platform as any },
      query: {
        profileId,
        redirect_url: redirectUrl,
      },
    });

    const authUrl = result.data?.authUrl || (result.data as any)?.url;

    if (!authUrl) {
      throw new Error("Failed to generate connect URL from Zernio");
    }

    res.status(200).json({
      success: true,
      url: authUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const syncAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }
    const profileId = await getOrCreateZernioProfile(req.user);

    const result = await zernio.accounts.listAccounts({
      query: { profileId } as any,
    });

    const rawData = result.data as any;
    const zernioAccounts: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.accounts || rawData?.data || [];

    const supportedPlatforms = ["facebook", "instagram", "linkedin", "twitter", "x"];
    const syncedAccounts: any[] = [];
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      for (const zAccount of zernioAccounts) {
        const zid = zAccount._id || zAccount.id;
        if (!zid) continue;

        const rawPlatform = (zAccount.platform || zAccount.type || zAccount.provider || "").toLowerCase();
        let normalizedPlatform = supportedPlatforms.find((p) => rawPlatform.includes(p));
        if (normalizedPlatform === "x") normalizedPlatform = "twitter";
        if (!normalizedPlatform) continue;

        const account = await Account.findOneAndUpdate(
          { zernioAccountId: zid },
          {
            user: req.user._id,
            platform: normalizedPlatform,
            handle: zAccount.handle || zAccount.username || zAccount.name || "LinkedIn User",
            zernioAccountId: zid,
            status: "connected",
            avatarUrl: zAccount.avatarUrl || zAccount.picture || "",
          },
          { upsert: true, new: true, session }
        );
        syncedAccounts.push(account);
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(200).json({
      success: true,
      message: "Accounts synced successfully",
      syncedAccounts,
      count: syncedAccounts.length,
    });
  } catch (error) {
    next(error);
  }
};