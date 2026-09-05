import cron from "node-cron";
import { Post } from "../models/Post.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";

export const initScheduler = (): void => {

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledFor: { $lte: now },
      });

      for (const post of postsToPublish) {
   try {
    const accounts = await Account.find({
        user: post.user,
        platform: {$in: post.platforms},
        status : "connected",
        zernioAccountId : {$exists: true}
    })

    if(accounts.length === 0){
        console.log(`No connected zernio account ${post._id}`)
        continue
    }
    
    const zernioPlatforms = accounts.map((acc)=>({
          tform: acc.platform as any,
          accountId: acc.zernioAccountId!
    }))

    const payload = {
        content : post.content,
        publishNow: true,
        ...(post.mediaUrl ? {mediaItems: [{type: post.mediaType || "image", url: post.mediaUrl}]}: {}),
        platforms : zernioPlatforms,
    }
  
   const response = await zernio.posts.createPost({
    body: payload
   })
 
   const publishedPost = (response.data as any)?.post || response.data
   if(!publishedPost){
    throw new Error("failed to get post")
   }

     post.status = "published";
     await post.save();

     await ActivityLog.create({
          user: post.user,
          actionType: "post_published",
          description: `Post successfully published to ${accounts.map((a)=> a.platform).join(", ")}`,
          relatedPost: post._id,
        });


   } catch (err: any) {
    console.log(err?.message);
    post.status = "failed",
    await post.save()
   }
      }

if (postsToPublish.length === 0) {
    console.log(`${postsToPublish.length}`)
}

    } catch (error) {
      console.error("[Scheduler Error]:", error);
    }
  });

  console.log("Background Post Scheduler initialized.");
};