// src/config/prisma.js

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import 'dotenv/config'

const globalForPrisma = globalThis

// Создаем адаптер для PostgreSQL
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

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