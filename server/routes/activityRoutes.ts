import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getActivity } from "../controllers/activityController.js";

const activityRouter = Router();

activityRouter.get("/", protect, getActivity);

export default activityRouter;