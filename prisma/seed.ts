import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.user.findMany({
    take:6
  });
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
          "$2b$10$9vcqIH0RP07KTvUS2qfebuoHSsjHR3WzzI4KWNNrUyPtaC6eogquW", // all seeded users have password="password" for easier testing
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

    console.log(`Created user with ID: ${user.id} with default password="password"`);
  }
  //create admin user
  const admin  = await prisma.user.create({
    data: {
      email: 'admin@email.com',
      firstName: 'Admin',
      lastName: 'Administrator',
      username: 'adminUser',
      password:
        "$2b$10$9vcqIH0RP07KTvUS2qfebuoHSsjHR3WzzI4KWNNrUyPtaC6eogquW", // all seeded users have password="password" for easier testing
      role: "admin",
    }
  });
  console.log(`Created administrator with id:${admin.id} with default password="password"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
