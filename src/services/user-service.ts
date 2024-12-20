import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
  static async findAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
  static async findUserById(id: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Finding user by id failed");
    }
  }
  static async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Finding user by email failed");
    }
  }
  static async createUser(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    role?: string
  ) {
    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password,
          role,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("User creation failed");
    }
  }

  static async isEmailTaken(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking email");
    }
  }

  static async isUsernameTaken(username: string): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking username");
    }
  }
}

export default UserService;
