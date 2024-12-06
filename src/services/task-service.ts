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
  static async findTasksByUserId(userId:number) {
    try {
      const tasks = await prisma.task.findMany({
        where:{
            userId
        }
      });
      return tasks;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
}

export default TaskService;
