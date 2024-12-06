import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {
  static async findAllTasks() {
    try {
      const tasks = await prisma.task.findMany();
      return tasks;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
  static async findTaskById(id: number) {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id,
        },
      });
      return task;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
  static async findTasksByUserId(userId: number) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
      });
      return tasks;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
  static async createTask(body: string, userId: number) {
    try {
      const task = await prisma.task.create({
        data: {
          body,
          userId,
        },
      });
      return task;
    } catch (error) {
      console.log(error);
      throw new Error("Task creation failed");
    }
  }
  static async deleteTask(id: number) {
    try {
      console.log({id});
      const task = await prisma.task.delete({
        where: {
          id,
        },
      });
      return task;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
}

export default TaskService;
