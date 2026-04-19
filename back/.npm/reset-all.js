import { prisma } from '../src/config/prisma.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

async function resetAll() {
  console.log('Cleaning database...')

  // 1. удаляем токены
  await prisma.session.deleteMany()

  // 2. удаляем пользователей
  await prisma.user.deleteMany()

  console.log(' Database cleared')

  // 3. создаём админа заново
  const email = 'webpolka@gmail.com'
  const password = '123456'

  const hash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      email,
      password: hash,
      role: 'admin',
    },
  })

  console.log('Admin created:', admin.email)
}

resetAll()
  .catch((e) => {
    console.error(' Error:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })