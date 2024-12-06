import UserService from "../services/user-service";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import util from "../util/util";
import jwt from "jsonwebtoken";

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
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await UserService.findUserByEmail(email);
    //@ts-ignore
    if (!(await util.checkPassword(user, password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const userData = util.removePropertyFromObject(user, password);

    if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error(
      "Server error: Missing ACCESS_TOKEN_SECRET environment variable."
    );
  }
  const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
    res.status(200).json({message:`Login of user ${email} successfull`, token});
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message || "User login failed" });
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
  login
};
