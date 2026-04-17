import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function resetAll() {
  console.log(" Cleaning database...");

  // 1. удаляем токены
  await prisma.token.deleteMany();

  // 2. удаляем пользователей
  await prisma.user.deleteMany();

  console.log(" Database cleared");

  // 3. создаём админа заново
  const email = "webpolka@gmail.com";
  const password = "1234";

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hash,
      role: "admin",
    },
  });

  console.log(" Admin created:", admin.email);
}

resetAll()
  .catch((e) => {
    console.error(" Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });