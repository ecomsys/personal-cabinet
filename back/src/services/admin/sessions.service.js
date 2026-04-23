import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";

/* =========================
   GET ALL SESSIONS (ADMIN)
========================= */
export const getAllSessions = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = {
    isValid: true,
  };

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      skip,
      take: limit,

      // ВАЖНО: стабильная сортировка (фикс “прыжков”)
      orderBy: [
        { lastUsedAt: "desc" },
        { id: "desc" },
      ],

      where,

      select: {
        id: true,
        ip: true,
        deviceId: true,
        lastUsedAt: true,
        createdAt: true,
        isValid: true,

        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    }),

    prisma.session.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return {
    data: sessions,
    meta: {
      page,
      limit,
      total,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    },
  };
};
/* =========================
   GET SESSION BY ID
========================= */
export const getSessionById = async (id) => {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!session) {
    throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  const { password, ...user } = session.user;

  return {
    id: session.id,
    user,
    ip: session.ip,
    userAgent: session.userAgent,
    deviceId: session.deviceId,
    isValid: session.isValid,
    lastUsedAt: session.lastUsedAt,
    createdAt: session.createdAt,
  };
};

/* =========================
   DELETE SESSION (ADMIN)
========================= */
export const deleteSession = async (id) => {
  const session = await prisma.session.findUnique({
    where: { id },
  });

  if (!session) {
    throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  }

  await prisma.session.update({
    where: { id },
    data: {
      isValid: false,
    },
  });

  return true;
};

/* =========================
   DELETE ALL SESSIONS (ADMIN)
========================= */
export const deleteAllSessions = async () => {
  await prisma.session.updateMany({
    data: {
      isValid: false,
    },
  });

  return true;
};
