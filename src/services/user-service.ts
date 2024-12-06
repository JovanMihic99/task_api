import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
  static async findAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
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
      throw new Error("Finding user by id failed");
    }
  }
}

export default UserService;
