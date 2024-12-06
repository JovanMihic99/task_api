import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length > 5) {
    console.log("Users already exist, skipping seed.");
    return;
  }
  console.log("Seeding your database...");
  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.word.noun() + faker.word.adverb() + Math.random() * 5,
        password:
          "$2b$10$4BmRFAqDgKloSlrRiENTxukqPg5mGeRQBjfWjvbN9QY7IXlvhB/zW", // all seeded users have password="password" for easier testing
        role: "basic",
        Task: {
          // @ts-ignore
          create: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map(
            () => ({
              body: faker.lorem.sentence(),
            })
          ),
        },
      },
    });

    console.log(`Created user with ID: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
