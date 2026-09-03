import { Router } from "express";
import { generateConnectUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/authMiddleware.js";


const socialAuthRoutes = Router();

socialAuthRoutes.get("/:platform/url", protect , generateConnectUrl);
socialAuthRoutes.get("/sync", protect, syncAccounts);

export default socialAuthRoutes;