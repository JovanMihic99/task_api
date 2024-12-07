import { Router } from "express";
import userController from "../controllers/user-controller";
import asyncHandler from "express-async-handler";
import validation from "../middleware/validation/user-validator";
import auth from "../middleware/auth";
const router = Router();

// admin routes
// GET /api/users
router.get("/", auth.authenticateJWT,auth.authorizeAdmin, asyncHandler(userController.getAllUsers));

// Unprotected routes
// POST /api/users/signup
router.post(
  "/signup",
  validation.requireSignupData,
  validation.validateEmail,
  validation.checkIsEmailTaken,
  validation.checkIsUsernameTaken,
  validation.validatePassword,
  asyncHandler(userController.signup)
);

// POST /api/users/login
router.post(
  "/login",
  validation.requrieLoginData,
  asyncHandler(userController.login)
);

export default router;
