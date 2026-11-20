import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import { initScheduler } from "./services/schedulerService.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";


const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, try again later" },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: "AI generation limit reached, try again later" },
});

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authLimiter, authRouter)
app.use("/api/oauth", socialAuthRoutes)
app.use("/api/accounts", accountRouter)
app.use("/api/posts/generate", aiLimiter);
app.use("/api/posts", postRouter)
app.use("/api/activity", activityRouter)

app.use(notFound);
app.use(errorHandler);

app.listen(port, async () => {
  await connectDB();
  initScheduler();
  console.log(`Server running at http://localhost:${port}`);
});