// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import UserService from "../services/user-service";

// Mocking the Prisma client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to ensure isolation
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Doe', username: 'janedoe', email: 'jane@example.com' }
      ];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await UserService.findAllUsers();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user retrieval fails', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('Database error'));

      await expect(UserService.findAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' };
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await UserService.findUserById(1);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      const result = await UserService.findUserById(999);
      
      expect(result).toBeNull();
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw an error if finding user by id fails', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(UserService.findUserById(1)).rejects.toThrow('Finding user by id failed');
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' };
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await UserService.findUserByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });

    it('should throw an error if finding user by email fails', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(UserService.findUserByEmail('john@example.com')).rejects.toThrow('Finding user by email failed');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' };
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await UserService.createUser('John', 'Doe', 'johndoe', 'password123', 'john@example.com');

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          role: undefined,
        },
      });
    });

    it('should throw an error if user creation fails', async () => {
      prisma.user.create.mockRejectedValue(new Error('User creation failed'));

      await expect(UserService.createUser('John', 'Doe', 'johndoe', 'password123', 'john@example.com'))
        .rejects
        .toThrow('User creation failed');
    });
  });

  describe('isEmailTaken', () => {
    it('should return true if email is taken', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' });

      const result = await UserService.isEmailTaken('john@example.com');

      expect(result).toBe(true);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });

    it('should return false if email is not taken', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      const result = await UserService.isEmailTaken('nonexistent@example.com');

      expect(result).toBe(false);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    });

    it('should throw an error if checking email fails', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(UserService.isEmailTaken('john@example.com')).rejects.toThrow('Error checking email');
    });
  });

  describe('isUsernameTaken', () => {
    it('should return true if username is taken', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', username: 'johndoe' });

      const result = await UserService.isUsernameTaken('johndoe');

      expect(result).toBe(true);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { username: 'johndoe' } });
    });

    it('should return false if username is not taken', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      const result = await UserService.isUsernameTaken('newuser');

      expect(result).toBe(false);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { username: 'newuser' } });
    });

    it('should throw an error if checking username fails', async () => {
      prisma.user.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(UserService.isUsernameTaken('johndoe')).rejects.toThrow('Error checking username');
    });
  });
});
