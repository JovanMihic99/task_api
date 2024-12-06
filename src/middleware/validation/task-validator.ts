import { Request, Response, NextFunction } from "express";

const requireTaskId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      error: "Task id request parameter is required.",
    });
    return;
  }
  next();
};

export default {
  requireTaskId,
};
