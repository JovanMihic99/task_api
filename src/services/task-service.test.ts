// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import TaskService from "../services/task-service";

// Mocking the Prisma client
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    task: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("findAllTasks", () => {
    it("should return tasks for a given page and userId", async () => {
      const mockTasks = [{ id: 1, body: "Test Task", userId: 1 }];

      prisma.task.findMany.mockResolvedValue(mockTasks);
      prisma.task.count.mockResolvedValue(10);

      const result = await TaskService.findAllTasks(1, 10, "desc", 1);

      expect(result.tasks).toEqual(mockTasks);
      expect(result.totalTasks).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { userId: 1 },
        orderBy: { id: "desc" },
      });
    });

    it("should return all tasks for a non-user (admin)", async () => {
      const mockTasks = [{ id: 1, body: "Test Task" }];
      prisma.task.findMany.mockResolvedValue(mockTasks);
      prisma.task.count.mockResolvedValue(5);

      const result = await TaskService.findAllTasks(1, 10, "asc");

      expect(result.tasks).toEqual(mockTasks);
      expect(result.totalTasks).toBe(5);
      expect(result.totalPages).toBe(1);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: "asc" },
      });
    });

    it("should throw an error if the order is invalid", async () => {
      await expect(TaskService.findAllTasks(1, 10, "invalid")).rejects.toThrow(
        "Sorting order must be equal to 'asc' or 'desc'"
      );
    });
  });

  describe("findTaskById", () => {
    it("should return a task by id", async () => {
      const mockTask = { id: 1, body: "Test Task", userId: 1 };
      prisma.task.findFirst.mockResolvedValue(mockTask);

      const result = await TaskService.findTaskById(1);

      expect(result).toEqual(mockTask);
      expect(prisma.task.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should return null if task not found", async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      const result = await TaskService.findTaskById(999);

      expect(result).toBeNull();
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      const mockTask = { id: 1, body: "Test Task", userId: 1 };
      prisma.task.create.mockResolvedValue(mockTask);

      const result = await TaskService.createTask("Test Task", 1);

      expect(result).toEqual(mockTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { body: "Test Task", userId: 1 },
      });
    });

    it("should throw an error if task creation fails", async () => {
      prisma.task.create.mockRejectedValue(new Error("Task creation failed"));

      await expect(TaskService.createTask("Test Task", 1)).rejects.toThrow(
        "Task creation failed"
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete a task by id", async () => {
      const mockTask = { id: 1, body: "Test Task", userId: 1 };
      prisma.task.delete.mockResolvedValue(mockTask);

      const result = await TaskService.deleteTask(1);

      expect(result).toEqual(mockTask);
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should throw an error if task deletion fails", async () => {
      prisma.task.delete.mockRejectedValue(new Error("Task deletion failed"));

      await expect(TaskService.deleteTask(999)).rejects.toThrow(
        "Task deletion failed"
      );
    });
  });
});
