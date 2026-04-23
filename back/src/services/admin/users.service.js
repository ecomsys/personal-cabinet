import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";

/* =========================
   GET ALL USERS (PAGINATED)
========================= */
export const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [admins, users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: { role: "admin" },
      orderBy: { createdAt: "desc" },
      include: {
        sessions: {
          select: {
            id: true,
            isValid: true,
            lastUsedAt: true,
          },
        },
      },
    }),

    prisma.user.findMany({
      where: { role: { not: "admin" } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        sessions: {
          select: {
            id: true,
            isValid: true,
            lastUsedAt: true,
          },
        },
      },
    }),

    prisma.user.count({
      where: { role: { not: "admin" } },
    }),
  ]);

  const mapUser = (u) => ({
    ...u,
    sessionsCount: u.sessions?.length || 0,
    activeSessions: u.sessions?.filter((s) => s.isValid)?.length || 0,
  });

  return {
    admins: admins.map(mapUser),
    users: users.map(mapUser),

    meta: {
      page,
      limit,
      total: totalUsers,
      pages: Math.ceil(totalUsers / limit),
    },
  };
};
/* =========================
   GET USER BY ID
========================= */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { sessions: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const { password, ...safe } = user;
  return safe;
};

/* =========================
   UPDATE USER (admin)
========================= */
export const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      status: data.status,
      role: data.role,
    },
  });

  const { password, ...safe } = updated;
  return safe;
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  await prisma.user.delete({ where: { id } });

  return true;
};
