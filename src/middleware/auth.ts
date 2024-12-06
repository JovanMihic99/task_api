import { type Request, type Response, type NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const authorizeAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (role !== "admin") {
      res.status(403).json({
        message: "You are not authorized to view this resource.",
      });
      return;
    }
    next();
  }
);

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        "Server error: Missing ACCESS_TOKEN_SECRET environment variable."
      );
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach decoded payload to req.user
    next(); 
  } catch (error: any) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = req.user;
  const userId = parseInt(req.params.userId);
  if (role === "admin") {
    next();
    return;
  }
  if (userId !== id) {
    console.log({ userId, id, role });
    res
      .status(401)
      .json({ error: "You are not authorized to use this resource" });
    return;
  }
  next();
};

const prohibitAdmin = (req: Request, res: Response, next: NextFunction) => {
  const {role} = req.user;
  if (role === "admin") {
    res
      .status(401)
      .json({ error: "Administrators are not authorized to use this resource" });
    return;
  }
  next();
};

export default {
  authorizeAdmin,
  authenticateJWT,
  authenticateUser,
  prohibitAdmin
};
