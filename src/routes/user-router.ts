import { Router } from "express";
import userController from "../controllers/user-controller";
import asyncHandler from "express-async-handler";
import validation from "../middleware/validation/user-validator";

const router = Router();

// GET /api/users
router.get("/", asyncHandler(userController.getAllUsers));

// POST /api/users/signup
router.post("/signup", 
    validation.requireSignupData,
    validation.validateEmail,
    validation.checkIsEmailTaken,
    validation.validatePassword,
    asyncHandler(userController.signup));

export default router;
