import { Request, Response, NextFunction } from "express";

const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    res.status(400).json({
      error: "Task id request parameter must be an Integer.",
    });
    return;
  }
  next();
};

export default {
    validateTaskId,
};
