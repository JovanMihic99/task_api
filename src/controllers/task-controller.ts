import TaskService from "../services/task-service";
import { Request, Response } from "express";

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const result = await TaskService.findAllTasks();
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

const getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params; 
    const result = await TaskService.findTasksByUserId(parseInt(userId));
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

export default {
  getAllTasks,
  getTasksByUserId,
};
