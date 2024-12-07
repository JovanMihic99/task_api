import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TaskService {
  static async findAllTasks(
    page: number = 1,
    limit = 10,
    order: string = "desc",
    userId?: number
  ) {
    try {
      if (order !== "desc" && order !== "asc") {
        throw new Error("Sorting order must be equal to 'asc' or 'desc'");
      }
      page = Math.floor(page); // in case user entered floats instead of integers
      limit = Math.floor(limit);
      let skip = (page - 1) * limit; // calculate number of tasks to skip based on page number
      let tasks;
      let totalTasks;
      if (userId) {
        totalTasks = await prisma.task.count({
          where: {
            userId,
          },
        });
        if (page > Math.ceil(totalTasks / limit)) {
          // return the last page if user entered a page number bigger than totalPages
          page = Math.ceil(totalTasks / limit);
          if (page === 0) page = 1;
          skip = (page - 1) * limit;
        }
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
        totalTasks = await prisma.task.count();
        if (page > Math.ceil(totalTasks / limit)) {
          // return the last page if user entered a page number bigger than totalPages
          page = Math.ceil(totalTasks / limit);
          if (page === 0) page = 1;
          skip = (page - 1) * limit;
        }
        tasks = await prisma.task.findMany({
          // for admins return all tasks
          skip: skip,
          take: limit,
          orderBy: {
            id: order,
          },
        });
      }

      return {
        tasks,
        totalTasks,
        page,
        totalPages: Math.ceil(totalTasks / limit), // calculate total pages
      };
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      console.error(error);
      throw new Error("Task creation failed");
    }
  }
  static async updateTask(id: number, body: string) {
    try {
      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          body,
        },
      });
      return task;
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw new Error(error as string);
    }
  }
}

export default TaskService;
