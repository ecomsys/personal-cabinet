// src/services/auth.service.js

import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

import { hashPassword, comparePassword } from "../utils/hash.js";

import { generateRefreshToken, generateAccessToken } from "../utils/jwt.js";

import { ApiError } from "../utils/api-error.js";
import { hashToken } from "../utils/crypto.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/*======================================================================================================
Register service
=======================================================================================================*/
export const register = async (email, password, meta) => {
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) throw new ApiError(409, "User already exists", "AUTH_USER_EXISTS");

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });

  const refreshToken = generateRefreshToken(user);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  const accessToken = generateAccessToken(user, session.id);

  return { user, accessToken, refreshToken };
};

/*======================================================================================================
Login service
=======================================================================================================*/
export const login = async (email, password, meta) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD");
  }

  // 1. сначала чистим старые сессии
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  const refreshToken = generateRefreshToken(user);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  const accessToken = generateAccessToken(user, session.id);

  return { user, accessToken, refreshToken };
};

/*======================================================================================================
Refresh service (PRO VERSION)
=======================================================================================================*/
export const refresh = async (refreshToken, meta) => {
  if (!refreshToken) {
    throw new ApiError(401, "Session expired", "AUTH_SESSION_EXPIRED");
  }

  // 1. verify refresh token
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Session expired", "AUTH_SESSION_EXPIRED");
  }

  // 2. get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new ApiError(401, "User not found", "AUTH_USER_NOT_FOUND");
  }

  // 3. find session by HASHED refresh token
  const hashedToken = hashToken(refreshToken);

  const currentSession = await prisma.session.findFirst({
    where: {
      refreshToken: hashedToken,
      userId: user.id,
      isValid: true,
    },
  });

  // REUSE DETECTION (важный момент)
  // если токен не найден → возможно украден или уже использован
  if (!currentSession) {
    // optional: kill all sessions for safety
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: { isValid: false },
    });

    throw new ApiError(
      401,
      "Session reused or expired",
      "AUTH_SESSION_REUSED"
    );
  }

  // 4. generate new tokens
  const newRefreshToken = generateRefreshToken(user);

  const newAccessToken = generateAccessToken(user, currentSession.id);

  // 5. ATOMIC UPDATE (важно против race condition)
  await prisma.$transaction(async (tx) => {
    // invalidate old session
    await tx.session.update({
      where: { id: currentSession.id },
      data: { isValid: false },
    });

    // create new session
    await tx.session.create({
      data: {
        userId: user.id,
        refreshToken: hashToken(newRefreshToken),
        userAgent: meta?.userAgent,
        ip: meta?.ip,
      },
    });
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
/*======================================================================================================
Logout service
=======================================================================================================*/
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await prisma.session.updateMany({
      where: { refreshToken: hashToken(refreshToken) },
      data: { isValid: false },
    });
  }

  return true;
};
