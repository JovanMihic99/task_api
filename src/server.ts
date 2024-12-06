import express, { Request, Response, NextFunction } from "express";
import dotnev from "dotenv"
import taskRouter from "./routes/task-router";
import userRouter from "./routes/user-router";
import errorHandler from './middleware/error-handler'

dotnev.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routing 
const router = express.Router();
app.use("/api",router);
router.use("/users",userRouter);
router.use("/tasks",taskRouter);

// Middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Task API listening on port ${port}...`);
});

export default app;