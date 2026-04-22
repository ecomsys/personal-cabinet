import { prisma } from "../../config/prisma.js";

/* =========================
   ADMIN STATS
========================= */
export const getStats = async () => {
  // 1. общее количество пользователей
  const users = await prisma.user.count();

  // 2. активные сессии
  const activeSessions = await prisma.session.count({
    where: {
      isValid: true,
    },
  });

  // 3. "онлайн" пользователи (активность за последние 5 минут)
  const onlineUsersGrouped = await prisma.session.findMany({
    where: {
      isValid: true,
      lastUsedAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
    distinct: ["userId"],
    select: {
      userId: true,
    },
  });

  const onlineUsers = onlineUsersGrouped.length;

  return {
    users,
    activeSessions,
    onlineUsers,
  };
};