// src/services/auth.service.js

import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";

import { logger } from "../utils/logger.js";
import { enforceSessionLimit } from "../utils/sessionLimit.js";
import { detectSuspiciousActivity } from "../utils/detectActivity.js";

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

  await enforceSessionLimit(user.id);
  await detectSuspiciousActivity(user.id, meta);

  const refreshToken = generateRefreshToken(user);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
      deviceId: meta?.deviceId,
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

  await enforceSessionLimit(user.id);
  await detectSuspiciousActivity(user.id, meta);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD");
  }

  const refreshToken = generateRefreshToken(user);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashToken(refreshToken),
      userAgent: meta?.userAgent,
      ip: meta?.ip,
      deviceId: meta?.deviceId,
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
    },
  });

  if (!currentSession) {
    logger.warn({
      type: "SECURITY",
      event: "REFRESH_TOKEN_NOT_FOUND",
      userId: decoded.id,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
    });

    throw new ApiError(401, "Session expired", "AUTH_SESSION_EXPIRED");
  }

  // DEVICE CHECK
  if (
    currentSession.deviceId &&
    meta?.deviceId &&
    currentSession.deviceId !== meta.deviceId
  ) {
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: { isValid: false },
    });

    logger.warn({
      type: "SECURITY",
      event: "DEVICE_MISMATCH",
      userId: user.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    throw new ApiError(401, "Device mismatch", "AUTH_DEVICE_MISMATCH");
  }

  await enforceSessionLimit(user.id);

  // 4. generate new tokens
  const newRefreshToken = generateRefreshToken(user);

  // 5. ATOMIC UPDATE (важно против race condition)
  let newSession;

  await prisma.$transaction(async (tx) => {
    await tx.session.update({
      where: { id: currentSession.id },
      data: {
        isValid: false,
        lastUsedAt: new Date(),
      },
    });

    newSession = await tx.session.create({
      data: {
        userId: user.id,
        refreshToken: hashToken(newRefreshToken),
        userAgent: meta?.userAgent,
        ip: meta?.ip,
        deviceId: meta?.deviceId,
      },
    });
  });

  const newAccessToken = generateAccessToken(user, newSession.id);

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
      where: {
        refreshToken: hashToken(refreshToken),
        isValid: true,
      },
      data: { isValid: false },
    });
  }

  return true;
};
