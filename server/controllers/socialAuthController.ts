import zernio from "../config/zernio.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Account } from "../models/Account.js";
import { User } from "../models/User.js";
import { Request, Response, NextFunction } from "express";

const getOrCreateZernioProfile = async (user: any): Promise<string> => {
  try {
    const result = await zernio.profiles.listProfiles();
    const data = result.data as any;
    const profiles: any[] = Array.isArray(data)
      ? data
      : data?.profiles || data?.data || [];

    if (profiles.length > 0) {
      const pid = profiles[0]._id || profiles[0].id;
      await User.findByIdAndUpdate(user._id, { zerniProfileId: pid });
      return pid;
    }

    const createdResult = await zernio.profiles.createProfile({
      body: { name: `${user.name || user.email}s workspace` } as any,
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

    const authUrl = result.data.authUrl;

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
    const profileId = await getOrCreateZernioProfile(req.user);
    const result = await zernio.accounts.listAccounts({
      query: { profileId } as any,
    });

    const zernioAccounts: any[] = result.data?.accounts || [];
    const supportedPlatforms = ["facebook", "instagram", "linkedin", "twitter"];
    const syncedAccounts = [];

    for (const zAccount of zernioAccounts) {
      const zid = zAccount._id || zAccount.id;
      if (!zid) {
        console.warn("Skipping account with no id:", zAccount);
        continue;
      }

      const rawPlatform = (
        zAccount.platform ||
        zAccount.type ||
        ""
      ).toLowerCase();
      const normalizedPlatform = supportedPlatforms.find((p) =>
        rawPlatform.includes(p),
      );
      if (!normalizedPlatform) {
        console.log(`Skiping unsupported platform: ${rawPlatform}`);
        continue;
      }

      const account = await Account.findOneAndUpdate(
        { zernioAccountId: zid },
        {
          user: req.user._id,
          platform: normalizedPlatform,
          handle:
            zAccount.handle || zAccount.username || zAccount.name || "Unknown",
          zernioAccountId: zid,
          status: "connected",
          avatarUrl:
            zAccount.avatarUrl ||
            zAccount.picture ||
            zAccount.profile_image_url ||
            "",
        },
        { upsert: true, new: true },
      );
      syncedAccounts.push(account);
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
