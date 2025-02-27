import { PrismaClient } from "@prisma/client";
import { users } from "../public/data";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function userSeeder(prisma: PrismaClient) {
  try {
    for (const user of users) {
      const hashedPassword = await hash(user.password, 10);
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
    }
    console.log("User data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const main = async () => {
  try {
    await userSeeder(prisma);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
