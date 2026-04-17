import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "webpolka@gmail.com";
  const password = "1234";

  const hashedPassword = await bcrypt.hash(password, 10);

  // проверяем, чтобы не создать дубль
  const exist = await prisma.user.findUnique({
    where: { email }
  });

  if (exist) {
    console.log("User already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin"
    }
  });

  console.log("Admin created");
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());