import { Router } from "express";
import auth from "../middleware/auth";
import asyncHandler from "express-async-handler";
import taskController from "../controllers/task-controller";
import taskValidator from "../middleware/validation/task-validator";

const router = Router();

// protect all task routes
router.use(auth.authenticateJWT);

// GET /api/tasks
router.get(
  "/",
  taskValidator.validateSort,
  asyncHandler(taskController.getTasks)
);

// POST /api/tasks
router.post(
  "/",
  auth.prohibitAdmin, // prohibit administrator from creating a task
  taskController.addTask
);

// PUT /api/tasks/:id
router.put("/:id", taskValidator.validateTaskBody, taskController.editTask);

// DELETE /api/tasks/:id
router.delete("/:id", taskValidator.validateTaskId, taskController.removeTask);

export default router;
