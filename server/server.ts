import "dotenv/config";
import express, { Request, Response ,NextFunction} from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import socialAuthRoutes from "./routes/socialAuthRoutes.js";


const app = express();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter)
app.use("/api/oauth", socialAuthRoutes)

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); 

  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
})

app.listen(port, () => {
      connectDB()
    console.log(`Server is running at http://localhost:${port}`);
});