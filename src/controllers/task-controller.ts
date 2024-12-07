import TaskService from "../services/task-service";
import { Request, Response } from "express";

const getTasks = async (req: Request, res: Response) => {
  try {
    const { role, id: userId } = req.user;
    const { page = 1, limit = 10, sorting = "new" } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    let parsedOrder;
    let result;
    if (sorting === "new") {
      parsedOrder = "desc";
    } else if (sorting === "old") {
      parsedOrder = "asc";
    }

    if (role === "admin") {
      result = await TaskService.findAllTasks(
        parsedPage,
        parsedLimit,
        parsedOrder
      ); // get all tasks for admins
    }
    if (role === "basic") {
      result = await TaskService.findAllTasks(
        parsedPage,
        parsedLimit,
        parsedOrder,
        parseInt(userId)
      ); // get tasks belonging to user for "basic" users
    }
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error fetching tasks from database: ", error);
    res
      .status(500)
      .json({ message: "Error fetching tasks from database: " + error });
    return;
  }
};

const addTask = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user; // change this later to not use req.params!
    console.log(userId);
    const { body: taskBody } = req.body;
    const result = await TaskService.createTask(taskBody, parseInt(userId));
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error creating task: ", error);
    res
      .status(500)
      .json({ message: "Error fetching tasks from database: " + error });
    return;
  }
};

const editTask = async (req: Request, res: Response) => {
  try {
    const { body } = req.body;
    const { id } = req.params;
    const { id: userId, role } = req.user;
    const task = await TaskService.findTaskById(parseInt(id));
    if (role === "basic" && parseInt(userId) !== task?.userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this task." });
      return
    }
    const result = await TaskService.updateTask(parseInt(id),body);
    res.status(200)
    .json({message:`Successfully updated task ${id}`, updatedTask:result})
  } catch (error) {
    console.error("Error updating task in database: ", error);
    res
      .status(500)
      .json({ message: "Error updating task in database: " + error });
    return;
  }
};

const removeTask = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await TaskService.findTaskById(id);

    if (req.user.id !== task?.userId && req.user.role === "basic") {
      // authenticate user and only allow him to delete his own content
      res
        .status(403)
        .json({ message: "You are not authorized to delete this task." });
      return;
    }
    // admins are implicitly allowed to delete any content
    const result = await TaskService.deleteTask(id);
    res.status(200).json({
      message: `Successfully deleted task with id ${id}`,
      deletedTask: result,
    });
    return;
  } catch (error) {
    console.error("Error fetching tasks from database: ", error);
    res
      .status(500)
      .json({ message: "Error fetching tasks from database: " + error });
    return;
  }
};

export default {
  getTasks,
  addTask,
  removeTask,
  editTask
};
