import { prisma } from "../config/prisma.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { generateTokens } from "../utils/jwt.js"
import { ApiError } from "../utils/api-error.js"


// register service
export const register = async (email, password) => {
  const exist = await prisma.user.findUnique({ where: { email } })
  if (exist) throw new ApiError(409, "User already exists", "AUTH_USER_EXISTS")

  const hashed = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed
    }
  })

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role
  })

  await prisma.token.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken
    }
  })

  return { user, tokens }
}

// login service
export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND")
  }

  const isValid = await comparePassword(password, user.password)
  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD")
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role
  })

  // 1. сначала чистим старые сессии
  await prisma.token.deleteMany({
    where: { userId: user.id }
  })

  // 2. потом создаём новую
  await prisma.token.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken
    }
  })

  return { user, tokens }
}


// refresh service
export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token", "AUTH_INVALID_REFRESH_TOKEN")
  }

  let userData

  try {
    userData = jwt.verify(refreshToken, REFRESH_SECRET)
  } catch (e) {
    throw new ApiError(401, "Invalid refresh token", "AUTH_INVALID_REFRESH_TOKEN")
  }

  const tokenFromDb = await prisma.token.findFirst({
    where: {
      refreshToken,
      userId: userData.id
    }
  })

  if (!tokenFromDb) {
    throw new ApiError(401, "Invalid refresh token", "AUTH_INVALID_REFRESH_TOKEN")
  }

  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  )

  return { accessToken }
}

// logout service
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await prisma.token.deleteMany({
      where: { refreshToken }
    })
  }

  return true
}