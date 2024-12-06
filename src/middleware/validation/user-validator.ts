import { Request, Response, NextFunction } from "express";
import UserService from "../../services/user-service";

const requireSignupData = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, username, password, email, role } = req.body;

  if (!firstName || !lastName || !username || !password || !email) {
    res.status(400).json({
      error: "firstName, lastName, username, email and password are required.",
    });
    return;
  }

  next();
};

const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const valid = email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!valid) {
    res.status(400).json({
      error: `Please enter a valid email (such as "example@email.com").`,
    });
    return;
  }
  next();
};

const checkIsEmailTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (await UserService.isEmailTaken(email)) {
    res.status(400).json({
      error: "Email is already taken, please choose a different one.",
    });
    return;
  }
  next();
};

const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (password.length < 5) {
    res.status(400).json({
      error: "Password must be at least 5 characters long.",
    });
    return;
  }

  next();
};

export default {
  requireSignupData,
  validatePassword,
  checkIsEmailTaken,
  validateEmail,
};
