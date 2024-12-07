import request from "supertest"; // Supertest for HTTP requests
import app from "../server"; // Import the app
import { PrismaClient } from "@prisma/client"; // Prisma Client to interact with the DB
import jwt from "jsonwebtoken"; // For creating JWT tokens (mocked)
import { config } from "dotenv";

config(); // Load environment variables (if needed)

const prisma = new PrismaClient();

let token: string; // JWT token for a basic user
let adminToken: string; // JWT token for an admin
let taskId: number; // Store task ID for testing delete operations

beforeAll(async () => {
  // Create a test user (basic) and an admin user
  const user = await prisma.user.create({
    data: {
      firstName: "Basic",
      lastName: "User",
      username: "basicuser",
      email: `basic-${Date.now()}@example.com`,
      password: "password123",
      role: "basic",
    },
  });

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: `admin-${Date.now()}@example.com`,
      password: "password123",
      role: "admin",
    },
  });

  // Generate JWT tokens for the users
  token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  adminToken = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  // Clean up the database after tests
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

describe("Task Routes Integration Tests", () => {
  describe("GET /api/tasks", () => {
    it("should fetch all tasks for an authenticated admin", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toBeDefined(); // Admin can fetch all tasks
    });

    it("should fetch only the user's tasks for an authenticated basic user", async () => {
      // Create a task for the basic user
      const taskRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Task for basic user" });

      taskId = taskRes.body.id;

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1); // Basic user sees only their own tasks
      expect(res.body.tasks[0].body).toBe("Task for basic user");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a task for an authenticated basic user", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ body: "Another task for basic user" });

      expect(res.status).toBe(200);
      expect(res.body.body).toBe("Another task for basic user");
    });

    it("should not allow admin to create a task", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ body: "Task for admin" });

      expect(res.status).toBe(403); // Admins are prohibited from creating tasks
      expect(res.body.error).toBeDefined();
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task for an authenticated basic user", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        `Successfully deleted task with id ${taskId}`
      );
    });

    it("should not allow a basic user to delete another user's task", async () => {
      // Create a task for the admin user
      const adminUser = await prisma.user.create({
        data: {
          email: "adminuser@example.com",
          username: "adminuser",
          firstName: "Admin",
          lastName: "User",
          password: "password123",
          role: "admin",
        },
      });
      const adminTask = await prisma.task.create({
        data: {
          body: "Admin's task",
          userId: adminUser.id, // Assuming admin's ID is 2
        },
      });

      const res = await request(app)
        .delete(`/api/tasks/${adminTask.id}`)
        .set("Authorization", `Bearer ${token}`); // Basic user tries to delete admin's task

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "You are not authorized to delete this task."
      );
    });

    it("should allow admin to delete any task", async () => {
      const basicUser = await prisma.user.create({
        data: {
          email: "basicuser@example.com",
          username: "basicuser",
          firstName: "Basic",
          lastName: "User",
          password: "password123",
          role: "basic",
        },
      });

      const basicUserTask = await prisma.task.create({
        data: {
          body: "Basic user's task",
          userId: basicUser.id, // Reference the newly created user
        },
      });

      const res = await request(app)
        .delete(`/api/tasks/${basicUserTask.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        `Successfully deleted task with id ${basicUserTask.id}`
      );
    });
  });
});