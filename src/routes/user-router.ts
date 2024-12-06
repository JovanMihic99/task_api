import { Router } from "express";
import userController from "../controllers/user-controller";
import asyncHandler from "express-async-handler";

const router = Router();

// GET /api/users
router.get("/", asyncHandler(userController.getAllUsers));

export default router;
