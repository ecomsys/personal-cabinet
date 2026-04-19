import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const globalForPrisma = globalThis

// Создаем адаптер для PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// Функция создания клиента с адаптером
const createPrismaClient = () => {
  return new PrismaClient({ adapter })
}

// Синглтон: используем существующий или создаём новый
export const prisma = globalForPrisma.prisma || createPrismaClient()

// В dev-режиме сохраняем в global, чтобы избежать множества подключений
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}