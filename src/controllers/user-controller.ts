import UserService from "../services/user-service";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import util from "../util/util";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, email, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await UserService.createUser(
      firstName,
      lastName,
      username,
      hashedPassword,
      email,
      role
    );

    const response = util.removePropertyFromObject(user, "password");
    res.status(201).json(response);
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "User creation failed" });
    return;
  }
};
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.findAllUsers();
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error fetching users from database: ", error);
    res
      .status(500)
      .json({ message: "Error fetching users from database: " + error });
    return;
  }
};

export default {
  getAllUsers,
  signup,
};
