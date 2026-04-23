import { prisma } from '../src/config/prisma.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import 'dotenv/config'

const USERS_COUNT = 20
const SESSIONS_COUNT = 40

/* =========================
   HELPERS
========================= */

const randomEmail = (i) => `user${i}@test.com`

const randomToken = () =>
  crypto.randomBytes(32).toString('hex')

const randomDate = () =>
  new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)

/* =========================
   MAIN SEED
========================= */

async function seed() {
  console.log(' Cleaning database...')

  //  порядок важен из-за связей
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creating admin...')

  const adminPassword = await bcrypt.hash('123456', 10)

  const admin1 = await prisma.user.create({
  data: {
    email: 'weblegko@gmail.com',
    password: adminPassword,
    role: 'admin',
  },
})

const admin2 = await prisma.user.create({
  data: {
    email: 'webpolka@gmail.com',
    password: adminPassword,
    role: 'admin',
  },
})

  console.log('Creating users...')

  const users = []

  for (let i = 1; i <= USERS_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        email: randomEmail(i),
        password: await bcrypt.hash('123456', 10),
        role: 'user',
      },
    })

    users.push(user)
  }

  console.log('Creating sessions...')

  const allUsers = [admin1, admin2, ...users]

  for (let i = 0; i < SESSIONS_COUNT; i++) {
    const user =
      allUsers[Math.floor(Math.random() * allUsers.length)]

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: randomToken(),
        ip: `192.168.0.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Seed Script',
        deviceId: `device-${Math.floor(Math.random() * 5)}`,
        isValid: Math.random() > 0.3, // 70% активных
        lastUsedAt: randomDate(),
      },
    })
  }

  console.log(' Seed completed!')
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })