import { Request, Response, NextFunction } from "express";

const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
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

const validateGetTasksQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const { sort,page,limit } = req.query;
  // @ts-ignore
  const parsedPage = parseInt(page);
  // @ts-ignore
  const parsedLimit = parseInt(limit);
  if (sort !== undefined && sort !== "new" && sort !== "old") {
    res.status(400).json({
      error: `sort must be a string with value "new" or "old"`,
    });
    return;
  }
  if( page !== undefined && (isNaN(parsedPage))){
    res.status(400).json({
      error: `page must be a number`,
    });
    return;
  }
  if( limit !== undefined && (isNaN(parsedLimit))){
    res.status(400).json({
      error: `limit must be a number`,
    });
    return;
  }
  if (page !== undefined && parsedPage <= 0 ) {
    res.status(400).json({
      error: `Page must be a number > 0`,
    });
    return;
  }
  if (limit !== undefined && parsedLimit <= 0 ) {
    res.status(400).json({
      error: `sort must be a string "new" or "old"`,
    });
    return;
  }

  next();
};

const validateTaskBody = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req.body;
  if (!body) {
    res.status(400).json({
      error: "Task body is required",
    });
    return;
  }
  if (typeof body !== "string") {
    res.status(400).json({
      error: "Task body must be a string.",
    });
    return;
  }
  next();
};

export default {
  validateTaskId,
  validateTaskBody,
  validateGetTasksQueryParams,
};
