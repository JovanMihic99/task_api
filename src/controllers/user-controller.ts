import UserService from "../services/user-service";
import { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.findAllUsers();
    res.status(200).json(result);
    return 
  } catch (error) {
    console.error("Error fetching users from database: ", error);
    res
      .status(500)
      .json({ message: "Error fetching users from database: " + error });
      return
  }
};

export default {
  getAllUsers,
};
