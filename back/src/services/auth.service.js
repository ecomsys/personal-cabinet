import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateTokens } from "../utils/jwt.js";
import { ApiError } from "../utils/api-error.js";

import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// register service
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

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  return { user, tokens };
};

// login service
export const login = async (email, password, meta) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD");
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // 1. сначала чистим старые сессии
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  return { user, tokens };
};

// refresh service
export const refresh = async (refreshToken, meta) => {
  if (!refreshToken) {
    throw new ApiError(
      401,
      "Session expired",
      "AUTH_SESSION_EXPIRED"
    );
  }

  let userData;

  try {
    userData = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    throw new ApiError(
      401,
      "Session expired",
      "AUTH_SESSION_EXPIRED"
    );
  }

  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      userId: userData.id,
      isValid: true,
    },
  });

  if (!session) {
    throw new ApiError(
      401,
      "Session expired",
      "AUTH_SESSION_EXPIRED"
    );
  }

  await prisma.session.delete({
    where: { id: session.id },
  });

  const tokens = generateTokens({
    id: userData.id,
    email: userData.email,
    role: userData.role,
  });

  await prisma.session.create({
    data: {
      userId: userData.id,
      refreshToken: tokens.refreshToken,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};


// logout service
export const logout = async (refreshToken) => {
  if (refreshToken) {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  return true;
};
