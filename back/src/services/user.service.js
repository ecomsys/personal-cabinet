// src/services/user.service.js

import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

/*================================================================================
Получить юзера
================================================================================*/
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const { password, ...safeUser } = user;

  return safeUser;
};

/*================================================================================
Получить все сессии
================================================================================*/
export const getSessions = async (userId, currentSessionId) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isValid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sessions.map((s) => ({
    id: s.id,
    ip: s.ip,
    userAgent: s.userAgent,
    deviceId: s.deviceId,
    lastUsedAt: s.lastUsedAt,
    createdAt: s.createdAt,
    isCurrent: s.id === currentSessionId, 
  }));
};

/*================================================================================
Покинуть конкретную сессию
================================================================================*/
export const deleteSession = async (userId, sessionId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: { isValid: false },
  });

  return true;
};
/*================================================================================
Покинуть все сессии
================================================================================*/
export const deleteOtherSessions = async (userId, currentSessionId) => {
  await prisma.session.updateMany({
    where: {
      userId,
      id: { not: currentSessionId },
    },
    data: {
      isValid: false,
    },
  });

  return true;
};
