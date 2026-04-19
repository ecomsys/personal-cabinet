import { prisma } from '../src/config/prisma.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

async function createAdmin() {
  const email = 'webpolka@gmail.com'
  const password = '1234'

  const hashedPassword = await bcrypt.hash(password, 10)

  const exist = await prisma.user.findUnique({
    where: { email }
  })

  if (exist) {
    console.log(' Admin already exists')
    return
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log(' Admin created successfully')
}

createAdmin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })