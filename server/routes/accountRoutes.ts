import { Router } from "express";
import {
  getUserAccounts,
  addAccount,
  disconnectAccount,
} from "../controllers/accountController.js";
import { protect } from "../middlewares/authMiddleware.js";

const accountRouter = Router();

accountRouter.get("/", protect, getUserAccounts);
accountRouter.post("/",protect,  addAccount);
accountRouter.delete("/:id",protect, disconnectAccount);

export default accountRouter;