import cron from "node-cron";
import { Post } from "../models/Post.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";

// Global Lock Flag to prevent overlapping executions
let isRunning = false;

export const initScheduler = (): void => {
  cron.schedule("* * * * *", async () => {
    // Agar pichli cycle abhi tak chal rahi hai toh new run skip karo
    if (isRunning) return;
    isRunning = true;

    try {
      const now = new Date();

      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledFor: { $lte: now },
      });

      if (postsToPublish.length === 0) {
        isRunning = false;
        return;
      }

      for (const post of postsToPublish) {
        try {
          // Normalize platforms array
          const targetPlatforms = Array.isArray(post.platforms)
            ? post.platforms
            : [post.platforms];

          // Flexible User ID extraction (handles 'user' or 'userId')
          const userId = post.user || (post as any).userId;

          // Fetch accounts with case-insensitive platform check
          const accounts = await Account.find({
            user: userId,
            platform: { $in: targetPlatforms.map((p: string) => new RegExp(`^${p}$`, "i")) },
            status: "connected",
          });

          if (!accounts || accounts.length === 0) {
            console.log(`[Scheduler] No connected account found for Post ID: ${post._id}`);
            post.status = "failed";
            await post.save();
            continue;
          }

          const zernioPlatforms = accounts
            .map((acc: any) => {
              const accountId = acc.zernioAccountId || acc.accountId || acc._id;
              if (!accountId) return null;
              return {
                platform: acc.platform,
                accountId: String(accountId),
              };
            })
            .filter(Boolean);

          if (zernioPlatforms.length === 0) {
            console.log(`[Scheduler] Account ID missing in database for Post ID: ${post._id}`);
            post.status = "failed";
            await post.save();
            continue;
          }

          const payload: any = {
            content: post.content,
            publishNow: true,
            platforms: zernioPlatforms,
          };

          if (post.mediaUrl) {
            payload.mediaItems = [
              {
                type: post.mediaType || "image",
                url: post.mediaUrl,
              },
            ];
          }

          const response = await zernio.posts.createPost({ body: payload });
          const publishedPost = (response.data as any)?.post || response.data;

          if (!publishedPost) {
            throw new Error("Failed to receive response from Zernio API");
          }

          post.status = "published";
          await post.save();

          await ActivityLog.create({
            user: userId,
            actionType: "post_published",
            description: `Post successfully published to ${accounts.map((a) => a.platform).join(", ")}`,
            relatedPost: post._id,
          });

          console.log(`[Scheduler] Post ${post._id} published successfully!`);
        } catch (err: any) {
          console.error(`[Scheduler Error for Post ${post._id}]:`, err?.message || err);
          post.status = "failed";
          await post.save();
        }
      }
    } catch (error) {
      console.error("[Scheduler Fatal Error]:", error);
    } finally {
      // Release lock for the next cycle
      isRunning = false;
    }
  });

  console.log("Background Post Scheduler initialized.");
};