// src/services/user.service.js

import fs from "fs";
import path from "path";

import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { getBaseUrl } from "../utils/helpers.js";

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
Обновить профиль
================================================================================*/
export const updateProfile = async (userId, data) => {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.avatarUrl !== undefined) {
    updateData.avatarUrl = data.avatarUrl;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  const { password, ...safeUser } = updated;

  return safeUser;
};

/*================================================================================
Смена пароля
================================================================================*/
export const changePassword = async (
  userId,
  currentPassword,
  newPassword,
  sessionId,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const isValid = await comparePassword(currentPassword, user.password);

  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD");
  }

  const hashed = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    // обновляем пароль
    await tx.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    // инвалидируем ВСЕ сессии КРОМЕ текущей
    await tx.session.updateMany({
      where: {
        userId,
        id: { not: sessionId },
      },
      data: {
        isValid: false,
      },
    });
  });

  return true;
};

/*================================================================================
Смена email
================================================================================*/
export const changeEmail = async (userId, newEmail, password, sessionId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  // проверка пароля
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new ApiError(401, "Wrong password", "AUTH_INVALID_PASSWORD");
  }

  // тот же email
  if (user.email === newEmail) {
    throw new ApiError(400, "Email is the same", "AUTH_EMAIL_SAME");
  }

  // проверка уникальности
  const exist = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (exist) {
    throw new ApiError(409, "Email already in use", "AUTH_EMAIL_EXISTS");
  }

  await prisma.$transaction(async (tx) => {
    // обновляем email
    await tx.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    // инвалидируем другие сессии
    await tx.session.updateMany({
      where: {
        userId,
        id: { not: sessionId },
      },
      data: {
        isValid: false,
      },
    });
  });

  return true;
};


/*================================================================================
Смена аватара
================================================================================*/
export const updateAvatar = async (userId, filename, req) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const baseUrl = getBaseUrl(req);
  const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

  //  вытаскиваем имя старого файла
  let oldFilename = null;
  if (user.avatarUrl) {
    oldFilename = user.avatarUrl.split("/uploads/avatars/")[1];
  }

  //  обновляем пользователя
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });

  //  удаляем старый файл (если был)
  if (oldFilename) {
    const filePath = path.join("uploads/avatars", oldFilename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Ошибка при удалении старого аватара:", err);
      }
    });
  }

  const { password, ...safeUser } = updatedUser;

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
