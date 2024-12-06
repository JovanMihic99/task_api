import { Router } from "express";
import auth from "../middleware/auth";
import asyncHandler from "express-async-handler";
import taskController from "../controllers/task-controller";

const router = Router();

// admin routes
// GET /api/tasks
router.get(
  "/",
  auth.authenticateJWT,
  auth.authorizeAdmin,
  asyncHandler(taskController.getAllTasks)
);
router.get(
  "/:userId",
  auth.authenticateJWT,
  auth.authenticateUser,
  asyncHandler(taskController.getTasksByUserId)
);
// Unprotected routes

// POST /api/tasks
router.post(
  "/:userId",
  auth.authenticateJWT,
  auth.authenticateUser,
  auth.prohibitAdmin, // prohibit administrator from creating a task
  taskController.addTask
);

// POST /api/users/login

export default router;
