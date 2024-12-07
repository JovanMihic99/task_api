import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {
  static async findAllTasks(
    page: number = 1,
    limit = 10,
    order: string = "desc",
    userId?: number,    
  ) {
    try {
      if (order !== "desc" && order !== "asc") {
        throw new Error("Sorting order must be equal to 'asc' or 'desc'");
      }
      const skip = (page - 1) * limit; // calculate number of tasks to skip based on page number
      let tasks;
      if (userId) {
        tasks = await prisma.task.findMany({
          // for basic users return their own tasks
          skip: skip,
          take: limit,
          where: {
            userId,
          },
          orderBy: {
            id: order,
          },
        });
      } else {
        tasks = await prisma.task.findMany({
          // for admins return all tasks
          skip: skip,
          take: limit,
          orderBy: {
            id: order,
          },
        });
      }

      const totalTasks = await prisma.task.count();
      return {
        tasks,
        totalTasks,
        page,
        totalPages: Math.ceil(totalTasks / limit), // calculate total pages
      };
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
  // static async findTasksByUserId(userId: number) {
  //   try {
  //     const tasks = await prisma.task.findMany({
  //       where: {
  //         userId,
  //       },
  //     });
  //     return tasks;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(error as string);
  //   }
  // }
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
  static async updateTask(id:number, body: string){
    try {
      const task = await prisma.task.update({
        where: {
          id
        },
        data: {
          body
        },
      })
      return task;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
  static async deleteTask(id: number) {
    try {

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
