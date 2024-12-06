import { Router } from "express";
import auth from "../middleware/auth";
import asyncHandler from "express-async-handler";
import taskController from "../controllers/task-controller";

const router = Router();

// protect all task routes
router.use(auth.authenticateJWT) 


// GET /api/tasks
router.get(
  "/",
  asyncHandler(taskController.getTasks)
);

// POST /api/tasks
router.post(
  "/",
  auth.prohibitAdmin, // prohibit administrator from creating a task
  taskController.addTask
);

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  taskController.removeTask
);

export default router;
