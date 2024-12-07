import { Request, Response, NextFunction } from "express";

const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if(!id){
    res.status(400).json({
      error: "Task id request parameter is required",
    });
    return;
  }
  if (isNaN(parseInt(id))) {
    res.status(400).json({
      error: "Task id request parameter must be an Integer.",
    });
    return;
  }
  next();
};
const validateTaskBody = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req.body;
  if(!body){
    res.status(400).json({
      error: "Task body is required",
    });
    return;
  }
  if (typeof body !== 'string') {
    res.status(400).json({
      error: "Task body must be a string.",
    });
    return;
  }
  next();
};

export default {
    validateTaskId,
    validateTaskBody
};
