import express from "express";
import dotnev from "dotenv"
import taskRouter from "./routes/task-router";
import userRouter from "./routes/user-router";
import errorHandler from './middleware/error-handler'
import setupSwagger from "./swagger/swagger";
dotnev.config();
const app = express();
const port = process.env.PORT || 3000;
console.log(process.env.DATABASE_PORT);
app.use(express.json());
setupSwagger(app);

// Routing 
const router = express.Router();
app.use("/api",router);
router.use("/users",userRouter);
router.use("/tasks",taskRouter);

// Middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Task API listening on port ${port}...`);
    console.log(
        `API documentation is available at http://localhost:${port}/api-docs`
      );
});

export default app;