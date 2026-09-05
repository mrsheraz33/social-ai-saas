import { Router } from "express";
import {
    generatePost,
    getGenerations,
    getPost,
    schedulePost,

} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";

const postRouter = Router();

postRouter.get("/", protect, getPost);
postRouter.get("/generations", protect, getGenerations);
postRouter.post("/", protect, upload.single("media"), schedulePost)
postRouter.post("/generate", protect,  generatePost)


export default postRouter;