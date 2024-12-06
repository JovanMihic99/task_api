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
  asyncHandler(taskController.getTasks)
);


// POST /api/tasks
router.post(
  "/",
  auth.authenticateJWT,
  auth.prohibitAdmin, // prohibit administrator from creating a task
  taskController.addTask
);

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  auth.authenticateJWT,
  taskController.removeTask
);

export default router;
