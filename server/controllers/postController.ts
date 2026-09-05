import { Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import { Generation } from "../models/Generation.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { cloudinary } from "../config/cloudinary.js";
import { Post } from "../models/Post.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const generatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt, tone = "professional", generateImage = false } = req.body;

    if (!prompt) {
      res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
      return;
    }

    
    const systemInstruction = `You are an expert social media manager.
     Create engaging content for social media based on the user request.
      Keep the tone ${tone}. Add relevant hashtags and emojis.
    Return ONLY a raw valid JSON object with no markdown backticks using this structure:
{
  "content": "the actual social media post text",
  "imagePrompt": "an optimized detailed visual description prompt for AI image generator"
}`;

    const interaction = await ai.interactions.create({
      model: "gemini-2.5-flash",
      input: `${systemInstruction}\n\nTopic/Prompt: ${prompt}`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = interaction.output_text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { content: rawText, imagePrompt: prompt };
        
      content = data.content || rawText;
      imagePrompt = data.imagePrompt || prompt;
    } catch (e) {
      content = interaction.output_text || "";
    }

    let mediaUrl = "";
    let mediaType: "image" | undefined = undefined;

    if (generateImage) {
      try {
        const imageBlob = (await hf.textToImage({
          model: "black-forest-labs/FLUX.1-schnell",
          inputs: imagePrompt, 
        })) as unknown as Blob;

        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: "saas_social_posts",
        });

        mediaUrl = uploadResponse.secure_url;
        mediaType = "image";
      } catch (imgError: any) {
        console.warn("Image Upload Error:", imgError?.message);
      }
    }

    const generation = await Generation.create({
      user: req.user._id,
      prompt,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      tone,
    });

    res.status(201).json({
      success: true,
      data: generation,
    });
  } catch (error) {
    next(error);
  }
}

export const getGenerations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
 
    const generations = await Generation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(generations);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const posts = await Generation.findOne({
      user: req.user._id,
    });

    if (!posts) {
      res.status(404).json({
        success: false,
        message: "Posts not found",
      });
      return;
    }

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const schedulePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;

    let parsePlatforms = platforms
    if(typeof platforms === "string"){
      try {
        parsePlatforms = JSON.parse(platforms)
      } catch (e) {
        parsePlatforms = platforms.split(",").map((p: string) => p.trim());
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl
    let mediaType: "image" | "video" | undefined = req.body.mediaType

    if(req.file){
      const result = await new Promise<any>((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream({
          resource_type : "auto",
          folder: "saas_social_posts",
        },
      (error, result)=>{
        if(error) reject(error)
        else resolve(result)
      })
      stream.end(req.file!.buffer)
      })
     mediaUrl = result.secure_url
     mediaType = result.resource_type === "video" ? "video" : "image"
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platforms:parsePlatforms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status,
    });
    
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};