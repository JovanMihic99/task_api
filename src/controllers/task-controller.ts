import TaskService from "../services/task-service";
import { Request, Response } from "express";

const getTasks = async (req: Request, res: Response) => {
  try {
    const { role, id: userId } = req.user;
    let result;
    if (role === "admin") {
      result = await TaskService.findAllTasks(); // get all tasks for admins
    }
    if (role === "basic") {
      result = await TaskService.findTasksByUserId(parseInt(userId)); // get tasks belonging to user for "basic" users
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
    const { body: taskBody } = req.body;
    const result = await TaskService.createTask(taskBody, parseInt(userId));
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

const removeTask = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await TaskService.findTaskById(id);

    //@ts-ignore
    if (req.user.id !== task.userId && req.user.role === "basic") {
      // authenticate user and only allow him to delete his own content
      res
        .status(400)
        .json({ message: "You are not authorized to delete this task." });
      return;
    }
    if (req.user.role === "admin") {
      // explicitly allow only admins to delete other users' content
      const result = await TaskService.deleteTask(id);
    }
    res
      .status(200)
      .json({ message: `Successfully deleted task with id ${id}` });
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
};
